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

# Nginx 이미지를 기반으로 하는 최종 이미지 단계
FROM nginx:alpine

# 빌드된 파일들을 Nginx가 서비스할 수 있도록 복사
COPY --from=build /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
