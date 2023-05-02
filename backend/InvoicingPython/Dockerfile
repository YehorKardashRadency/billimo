FROM python:3.10-alpine AS builder

WORKDIR /app

COPY requirements.txt /app

RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

RUN pip3 install -r requirements.txt

COPY . /app

ENTRYPOINT []