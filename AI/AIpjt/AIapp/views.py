import os
import numpy as np
import matplotlib.pyplot as plt
import parselmouth
from parselmouth.praat import call
# Todo: render, redirect 모두 rest_framework 로 바꾸기

# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from rest_framework import status
from django.shortcuts import render, redirect
from django.conf import settings
from .forms import AudioFileForm
from .models import AudioFile
from difflib import SequenceMatcher
import wave
import json
import requests
import logging

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ClovaSpeechClient:
    # Clova Speech invoke URL
    invoke_url = settings.INVOKE_URL
    # Clova Speech secret key
    secret = settings.SECRET

    def req_upload(self, file, completion, callback=None, userdata=None, forbiddens=None, boostings=None,
                   wordAlignment=True, fullText=True, diarization=None, sed=None):
        request_body = {
            'language': 'ko-KR',
            'completion': completion,
            'callback': callback,
            'userdata': userdata,
            'wordAlignment': wordAlignment,
            'fullText': fullText,
            'forbiddens': forbiddens,
            'boostings': boostings,
            'diarization': diarization,
            'sed': sed,
        }
        headers = {
            'Accept': 'application/json;UTF-8',
            'X-CLOVASPEECH-API-KEY': self.secret
        }
        files = {
            'media': open(file, 'rb'),
            'params': (None, json.dumps(request_body, ensure_ascii=False).encode('UTF-8'), 'application/json')
        }
        try:
            response = requests.post(url=self.invoke_url + '/recognizer/upload', headers=headers, files=files)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            logger.error(f"Error during Clova Speech API request: {e}")
            return None

# 음성 피치 분석 정보
def extract_pitch(audio_file):
    snd = parselmouth.Sound(audio_file)
    pitch = call(snd, "To Pitch", 0.0, 75, 600)  # 75 Hz to 600 Hz의 범위로 피치를 계산
    pitch_values = pitch.selected_array['frequency']
    pitch_values = pitch_values[pitch_values != 0]  # 0인 값 제거
    return pitch_values

# 오디오 파일의 샘플 레이트 측정하는 함수
def get_sample_rate(audio_file_path):
    with wave.open(audio_file_path, 'rb') as wav_file:
        return wav_file.getframerate()

# 오디오 스크립트화 하는 함수
def transcribe_audio(audio_file_path):
    try:
        client = ClovaSpeechClient()
        res = client.req_upload(file=audio_file_path, completion='sync')
        
        if res is None:
            return None

        res_json = res.json()
        logger.debug(f"API Response: {res_json}")

        if "segments" not in res_json or not res_json["segments"]:
            logger.error("No transcription segments found in response.")
            return None

        res_text = res_json["segments"][0]["text"]
        return res_text
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        return None

# 오디오를 업로드 받는 함수
def upload_audio(request):
    if request.method == 'POST':
        form = AudioFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('audioapp:audio_list')
    else:
        form = AudioFileForm()
    return render(request, 'audioapp/upload.html', {'form': form})

# 오디오 리스트 반환하는 함수
def audio_list(request):
    audios = AudioFile.objects.all()
    return render(request, 'audioapp/audio_list.html', {'audios': audios})

# 스크립트 유사도 함수
def script_similarity_ratio(original, transcribed):
    if original is None or transcribed is None:
        logger.error("One of the transcripts is None.")
        return 0
    return SequenceMatcher(None, original, transcribed).ratio()

# 오디오 비교해서 분석하는 함수
def analyze_audio(request):
    if request.method == 'POST':
        # Todo : api 통신으로 받아올 데이터를 넣어야 합니다.
        # 그 중에는 유저음성파일 하나, 정답파일path 가 있을 것 
        media_path = os.path.join(settings.BASE_DIR, 'media', 'audios')
        voice1 = os.path.join(media_path, 'voice1.wav')
        voice2 = os.path.join(media_path, 'voice2.wav')

        if not os.path.exists(voice1) or not os.path.exists(voice2):
            return render(request, 'audioapp/error.html', {'message': 'Required audio files are missing.'})

        try:
            # 첫 번째 음원 처리
            pitch_values1 = extract_pitch(voice1)
            
            # 두 번째 음원 처리
            pitch_values2 = extract_pitch(voice2)

            # 크로스 코릴레이션 유사성 계산
            def cross_correlation_similarity(signal_a, signal_b):
                correlation = np.correlate(signal_a, signal_b, mode='full')
                max_correlation = np.max(correlation)
                normalized_correlation = max_correlation / (np.linalg.norm(signal_a) * np.linalg.norm(signal_b))
                similarity_percent = normalized_correlation * 100
                return similarity_percent

            similarity = cross_correlation_similarity(pitch_values1, pitch_values2)

            # 음원 텍스트 변환
            transcript1 = transcribe_audio(voice1)
            transcript2 = transcribe_audio(voice2)

            if transcript1 is None or transcript2 is None:
                return render(request, 'audioapp/error.html', {'message': 'Transcription failed.'})

            # 텍스트 유사도
            script_similarity = script_similarity_ratio(transcript1, transcript2) * 100

            # 결과를 문자열로 저장
            analysis_result = f'Voice Similarity Percent: {similarity}%\n'
            analysis_result += f'Script Similarity Percent: {script_similarity}%\n'
            analysis_result += f'Transcription of Audio 1: {transcript1}\n'
            analysis_result += f'Transcription of Audio 2: {transcript2}\n'

            # 피치 시각화
            plt.figure(figsize=(10, 5))
            plt.plot(pitch_values1, 'r', label='Audio 1', linewidth=2.5)
            plt.plot(pitch_values2, 'b', label='Audio 2', linewidth=2.5)
            plt.title('Pitch Contour Comparison', fontsize=20, weight='bold')
            plt.xlabel('Time', fontsize=15)
            plt.ylabel('Frequency (Hz)', fontsize=15)
            plt.legend(title='Legend', title_fontsize='13', fontsize='12')
            plt.grid(True, linestyle='--', alpha=0.6)
            plot_file = os.path.join(media_path, 'pitch_comparison.png')
            plt.savefig(plot_file)
            plt.close()
        except Exception as e:
            logger.error(f"Error analyzing audio: {e}")
            return render(request, 'audioapp/error.html', {'message': str(e)})

        return render(request, 'audioapp/analysis_result.html', {'output': analysis_result, 'plot_file': 'audios/pitch_comparison.png'})
    return redirect('audioapp:audio_list')
