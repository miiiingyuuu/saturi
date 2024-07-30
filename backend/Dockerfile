FROM openjdk:17-jdk
LABEL maintainer="heo_dongwon@naver.com"
ARG JAR_FILE=build/libs/backend-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} backend-springboot.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/backend-springboot.jar"]
