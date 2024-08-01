# 가져올 이미지 정의
FROM node:20.15.0 AS build

# 경로 설정
WORKDIR /app

# package.json 워킹 디렉토리에 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 결과물 복사
COPY . .

# 빌드하기
RUN npm run build

# 빌드된 파일들을 Nginx가 서비스할 수 있도록 build 폴더 복사
RUN cp -r app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 3000

# 실행 명령어 정의
CMD ["npm", "start"]
