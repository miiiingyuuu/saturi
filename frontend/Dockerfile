# 가져올 이미지 정의
FROM node:20.15.0 AS build

# 작업 폴더를 만들기
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# 의존성 설치
COPY package*.json /usr/src/app/
RUN npm install

# 결과물을 작업폴더로 복사하고 빌드
COPY . /usr/src/app
RUN npm run build

# 빌드된 파일들을 Nginx가 서비스할 수 있도록 build 폴더 복사
RUN cp -r /usr/src/app/.next /usr/share/nginx/html

# 포트 노출
EXPOSE 3000

# 실행 명령어 정의
CMD ["npm", "start"]
