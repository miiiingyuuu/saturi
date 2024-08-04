# ./Dockerfile 
FROM python:3

ENV PYTHONUNBUFFERED 1

RUN apt-get -y update && apt-get -y install vim && apt-get clean
RUN mkdir /project
ADD . /project

WORKDIR /project
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

## Run the application on the port 8080
EXPOSE 8000

# gunicorn 배포 명령어
# CMD ["gunicorn", "--bind", "허용하는 IP:열어줄 포트", "project.wsgi:application"]
CMD ["gunicorn", "--bind", "127.0.0.1:8000", "stock.wsgi:application"]
