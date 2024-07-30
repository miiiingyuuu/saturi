# 가져올 이미지 정의
FROM node:20.15.0

# 경로 설정
WORKDIR /app

# package.json 워킹 디렉토리에 복사
 COPY frontend/package*.json ./

# 의존성 설치
RUN npm install

# 결과물 복사
COPY frontend/ ./

# 빌드하기
RUN npm run build

# 포트 노출
EXPOSE 3000

# 실행 명령어 정의
CMD ["npm", "start"]