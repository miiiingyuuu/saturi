# 베이스 이미지로 Python 3 사용
FROM python:3

# 작업 디렉토리 설정
WORKDIR /AIpjt

# 필요 패키지 복사 및 설치
COPY requirements.txt .
RUN pip install -r requirements.txt

# 소스 파일 복사
COPY . .

# 포트 8000 노출
EXPOSE 8000

# Django 서버 실행 명령어
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
