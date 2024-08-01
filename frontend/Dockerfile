# 가져올 이미지 정의
FROM node:20.15.0 AS build

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx를 위한 production 이미지
FROM nginx:alpine
COPY --from=build /usr/src/app/.next /usr/share/nginx/html/.next
COPY --from=build /usr/src/app/public /usr/share/nginx/html/public
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/nginx.conf

# Nginx 컨테이너 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
