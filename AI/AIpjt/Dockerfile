FROM python:3

COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt

WORKDIR /app/mysite
EXPOSE 8000
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
