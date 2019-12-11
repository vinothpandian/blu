FROM python:3.6.9-stretch

WORKDIR /code

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

ADD . .

CMD ["python", "app.py"]