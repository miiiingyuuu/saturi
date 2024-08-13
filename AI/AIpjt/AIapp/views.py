import io
import json
import tempfile
import logging
from decimal import Decimal
from google.cloud import storage
import requests
from rest_framework.decorators import api_view
from rest_framework import status
from django.conf import settings
from django.http import JsonResponse
from .serializers import CommingDataSerializer
from difflib import SequenceMatcher
import parselmouth
from parselmouth.praat import call
import numpy as np
import librosa
import noisereduce as nr
from scipy.spatial.distance import euclidean
from numpy.linalg import norm

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def load_wav_file_from_gcs(file_name, bucket_name='saturi'):
    """Google Cloud Storage에서 WAV 파일을 메모리에 로드합니다."""
    try:
        # Google Cloud Storage 클라이언트 초기화
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_name)

        # 파일 존재 여부 확인
        if not blob.exists():
            logger.error(f"File '{file_name}' does not exist in bucket '{bucket_name}'.")
            return None

        # 파일을 메모리로 다운로드
        file_data = io.BytesIO()
        blob.download_to_file(file_data)
        file_data.seek(0)  # 파일 포인터를 되감기
        logger.info(f"File '{file_name}' successfully loaded into memory.")
        return file_data

    except Exception as e:
        logger.error(f"Error loading file '{file_name}' from Google Cloud Storage: {e}")
        raise

def extract_pitch(audio_data):
    """메모리에 있는 WAV 오디오 데이터에서 피치 값을 추출합니다."""
    try:
        # 포인터 위치 초기화
        audio_data.seek(0)
        # 임시 파일 생성
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav_file:
            temp_wav_file.write(audio_data.read())  # BytesIO 객체의 내용을 파일에 씁니다
            temp_wav_file.flush()  # 내용을 디스크에 저장
            temp_wav_file.seek(0)  # 파일 포인터를 처음으로 이동

            # 임시 파일 경로를 사용하여 Sound 객체 생성
            audio = parselmouth.Sound(temp_wav_file.name)
            pitch = call(audio, "To Pitch", 0.0, 75, 600)  # 75Hz에서 600Hz 범위로 피치 계산
            pitch_values = pitch.selected_array['frequency']
            times = pitch.xs()  # 시간 간격 가져오기
            non_zero_indices = pitch_values != 0  # 0이 아닌 피치 값의 인덱스
            
            # 0 값을 제거
            filtered_times = times[non_zero_indices]
            filtered_pitch_values = pitch_values[non_zero_indices]

            # 피치 값을 소수점 두 번째 자리까지 반올림
            rounded_pitch_values = [float((round(pitch, 2))) for pitch in filtered_pitch_values]
            rounded_time_values = [float(round(time,2)) for time in filtered_times]

            # 시간 간격과 반올림된 피치 값을 리스트로 반환
            return rounded_time_values, rounded_pitch_values
    except Exception as e:
        logger.error(f"Error extracting pitch: {e}")
        raise


def transcribe_audio(audio_data):
    """오디오 데이터를 Clova Speech API를 사용하여 텍스트로 변환합니다."""
    client = ClovaSpeechClient()
    response = client.req_upload(audio_data)

    if response is None:
        return None

    try:
        response_json = response.json()
    except json.JSONDecodeError:
        logger.error("JSON 응답 디코딩 실패.")
        return None

    logger.debug(f"API 응답: {response_json}")

    if "segments" not in response_json or not response_json["segments"]:
        logger.error("응답에 세그먼트가 없습니다.")
        return None

    transcription = ' '.join(segment['text'] for segment in response_json["segments"])
    return transcription

class ClovaSpeechClient:
    invoke_url = settings.CLOVA_SPEECH_INVOKE_URL
    secret = settings.CLOVA_SPEECH_SECRET

    def req_upload(self, file_data, completion='sync'):
        request_body = {
            'language': 'ko-KR',
            'completion': completion,
            'wordAlignment': True,
            'fullText': True
        }
        headers = {
            'Accept': 'application/json;UTF-8',
            'X-CLOVASPEECH-API-KEY': self.secret
        }
        files = {
            'media': file_data,
            'params': (None, json.dumps(request_body, ensure_ascii=False).encode('UTF-8'), 'application/json')
        }

        # 추가 디버깅: 파일 크기와 상태 확인
        file_data.seek(0, io.SEEK_END)
        logger.debug(f"Uploading file of size: {file_data.tell()} bytes")
        file_data.seek(0)

        try:
            response = requests.post(url=self.invoke_url + '/recognizer/upload', headers=headers, files=files)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            logger.error(f"Clova Speech API 요청 중 오류 발생: {e}")
            return None
    

def script_similarity_ratio(original, transcribed):
    """두 스크립트 간의 유사도 비율을 계산합니다."""
    if original is None or transcribed is None:
        logger.error("스크립트 중 하나가 None입니다.")
        return 0
    return SequenceMatcher(None, original, transcribed).ratio()

# @api_view(['POST','OPTIONS'])
# def analyze_audio(request):
#     serializer = CommingDataSerializer(data=request.data)
#     if serializer.is_valid():
#         answer_voice_file = serializer.validated_data['answerVoiceFileName']
#         user_voice_file = serializer.validated_data['userVoiceFileName']
#         answer_script = serializer.validated_data['answerScript']

#         try:
#             # Google Cloud Storage에서 파일 데이터를 메모리에 로드
#             answer_voice_data = load_wav_file_from_gcs(answer_voice_file)
#             user_voice_data = load_wav_file_from_gcs(user_voice_file)

#             if answer_voice_data is None or user_voice_data is None:
#                 return JsonResponse({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)

#             # 첫 번째 음원 처리
#             answer_time, answer_pitch = extract_pitch(answer_voice_data)

#             # 두 번째 음원 처리
#             user_time, user_pitch = extract_pitch(user_voice_data)

#             # 크로스 코릴레이션 유사성 계산
#             def cross_correlation_similarity(signal_a, signal_b):
#                 if len(signal_a) == 0 or len(signal_b) == 0:
#                     logger.warning("피치 시퀀스 중 하나가 비어 있습니다.")
#                     return 0
#                 correlation = np.correlate(signal_a, signal_b, mode='full')
#                 max_correlation = np.max(correlation)
#                 normalized_correlation = max_correlation / (np.linalg.norm(signal_a) * np.linalg.norm(signal_b))
#                 similarity_percent = normalized_correlation * 100
#                 return similarity_percent

#             voice_similarity = cross_correlation_similarity(answer_pitch, user_pitch)

#             # 음원 텍스트 변환
#             transcript1 = answer_script
#             transcript2 = transcribe_audio(user_voice_data)

#             if transcript1 is None or transcript2 is None:
#                 return JsonResponse({'error': 'Transcription failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#             # 텍스트 유사도
#             script01 = transcript1.replace(" ","")
#             transcript01 = script01.replace(".","")
#             script02 = transcript2.replace(" ","")
#             transcript02 = script02.replace(".","")
#             script_similarity = script_similarity_ratio(transcript01, transcript02) * 100

#             # 데이터 생성
#             sending_data = {
#                 'voiceSimilarity': int(Decimal(str(voice_similarity))),
#                 'scriptSimilarity': int(Decimal(str(script_similarity))),
#                 'answerVoicePitch': str(answer_pitch),
#                 'userVoicePitch': str(user_pitch),
#                 'userVoiceTime':str(user_time),
#                 'userScript': transcript2
#             }

#             # JSON으로 반환
#             return JsonResponse(sending_data, status=status.HTTP_200_OK)

#         except Exception as e:
#             logger.error(f"오디오 분석 중 오류 발생: {e}")
#             return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#     else:
#         return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 음성 파일 로드 및 노이즈 제거
def load_and_denoise(file_path):
    y, sr = librosa.load(file_path, sr=None)
    y_denoised = nr.reduce_noise(y=y, sr=sr)
    return y_denoised, sr

# MFCC 추출
def extract_mfcc(y, sr):
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return mfcc.T  # 전치하여 (프레임, MFCC 계수) 형태로 반환

# 피치 추출
def extract_pitch(y, sr):
    pitches, magnitudes = librosa.core.piptrack(y=y, sr=sr)
    pitch = []
    for t in range(pitches.shape[1]):
        index = magnitudes[:, t].argmax()
        pitch_value = pitches[index, t]
        if pitch_value > 0:  # 유효한 피치 값만 사용
            pitch.append(pitch_value)
    return np.array(pitch)  # 1차원 벡터로 변환

# 각 시점에서의 기울기 계산
def calculate_slope(y):
    slopes = np.diff(y)
    return slopes

def euclidean_distance(point1, point2):
    point1 = np.array(point1)
    point2 = np.array(point2)
    return np.sqrt(np.sum((point1 - point2) ** 2))

# 두 기울기 벡터의 DTW 거리 계산
def dtw_distance(x, y, dist):
    m = len(x)
    n = len(y)
    
    # DTW 행렬 초기화
    dtw = np.zeros((m+1, n+1))
    
    # 첫 번째 행 초기화 (경로 시 제외하기 위해)
    dtw[0, 1:] = np.inf
    
    # 첫 번째 열 초기화 (경로 시 제외하기 위해)
    dtw[1:, 0] = np.inf
    
    # DTW 행렬 계산
    for i in range(1, m+1):
        for j in range(1, n+1):
            cost = dist(x[i-1], y[j-1])
            dtw[i, j] = cost + min(dtw[i-1, j], dtw[i, j-1], dtw[i-1, j-1])
    
    # DTW 거리 반환
    return dtw[m, n]

# 가중치 적용
def apply_salt(dtw_distance, factor=0.1):
    # DTW 값에 비례하여 salt를 적용
    salt = factor * dtw_distance
    return dtw_distance + salt

# DTW 거리 값을 백분율로 변환
def dtw_similarity_percentage(dtw_dist, max_dist):
    # 유사도가 높을수록 (거리값이 작을수록) 백분율이 100에 가까워짐
    similarity = 1 - (dtw_dist / max_dist)
    percentage = similarity * 100
    return max(0, min(percentage, 100))  # 0%에서 100% 사이의 값으로 제한

# 최대 거리 값을 설정 (예: 임의로 큰 값 설정)
max_possible_dist = 100000  # 이 값은 사용할 데이터셋에 따라 적절히 설정

@api_view(['POST','OPTIONS'])
def analyze_audio(request):
    serializer = CommingDataSerializer(data=request.data)
    if serializer.is_valid():
        answer_voice_file = serializer.validated_data['answerVoiceFileName']
        user_voice_file = serializer.validated_data['userVoiceFileName']
        answer_script = serializer.validated_data['answerScript']

        try:
            # Google Cloud Storage에서 파일 데이터를 메모리에 로드
            answer_voice_data = load_wav_file_from_gcs(answer_voice_file)
            user_voice_data = load_wav_file_from_gcs(user_voice_file)

            if answer_voice_data is None or user_voice_data is None:
                return JsonResponse({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)

            # 음성 파일 로드 및 노이즈 제거
            y_standard, sr_standard = load_and_denoise(answer_voice_data)
            y_dialect, sr_dialect = load_and_denoise(user_voice_data)
            
            # 음성 파일의 피치 추출
            pitch_standard = extract_pitch(y_standard, sr_standard)
            pitch_dialect = extract_pitch(y_dialect, sr_dialect)

                # 피치 배열이 1차원인지 확인 및 보정
            pitch_standard = np.array(pitch_standard).flatten()
            pitch_dialect = np.array(pitch_dialect).flatten()

            pitch_standard_str = '[' + ', '.join([f"{round(float(val), 2)}" for val in pitch_standard]) + ']'
            pitch_dialect_str = '[' + ', '.join([f"{round(float(val), 2)}" for val in pitch_dialect]) + ']'

                # 음정 값 사이의 기울기 값 뽑기
            pitch_standard = calculate_slope(pitch_standard)
            pitch_dialect = calculate_slope(pitch_dialect)

            # fastdtw를 사용하여 피치 간의 유사도 계산
            dtw_dist = dtw_distance(pitch_standard, pitch_dialect, euclidean_distance)

            # 가중치 적용
            dtw_dist = apply_salt(dtw_dist)
            
            # 거리 값을 백분율로 변환
            similarity_percentage = dtw_similarity_percentage(dtw_dist, max_possible_dist)

            # answer_time, answer_pitch = extract_pitch(answer_voice_data)

            # 두 번째 음원 처리
            # user_time, user_pitch = extract_pitch(user_voice_data)

            # 크로스 코릴레이션 유사성 계산
            def cross_correlation_similarity(signal_a, signal_b):
                if len(signal_a) == 0 or len(signal_b) == 0:
                    logger.warning("피치 시퀀스 중 하나가 비어 있습니다.")
                    return 0
                correlation = np.correlate(signal_a, signal_b, mode='full')
                max_correlation = np.max(correlation)
                normalized_correlation = max_correlation / (np.linalg.norm(signal_a) * np.linalg.norm(signal_b))
                similarity_percent = normalized_correlation * 100
                return similarity_percent

            # voice_similarity = cross_correlation_similarity(answer_pitch, user_pitch)

            # 음원 텍스트 변환
            transcript1 = answer_script
            transcript2 = transcribe_audio(user_voice_data)

            if transcript1 is None or transcript2 is None:
                return JsonResponse({'error': 'Transcription failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 텍스트 유사도
            script01 = transcript1.replace(" ","")
            transcript01 = script01.replace(".","")
            script02 = transcript2.replace(" ","")
            transcript02 = script02.replace(".","")
            script_similarity = script_similarity_ratio(transcript01, transcript02) * 100

            # 데이터 생성
            sending_data = {
                'voiceSimilarity': int(Decimal(str(similarity_percentage))),
                'scriptSimilarity': int(Decimal(str(script_similarity))),
                'answerVoicePitch': str(pitch_standard_str),
                'userVoicePitch': str(pitch_dialect_str),
                'userVoiceTime':str(""),
                'userScript': transcript2
            }

            # JSON으로 반환
            return JsonResponse(sending_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"오디오 분석 중 오류 발생: {e}")
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)