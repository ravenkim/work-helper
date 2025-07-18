#!/bin/bash

SERVICE_NAME=work-helper

echo "1. 기존 컨테이너 중지 및 제거..."
docker-compose stop $SERVICE_NAME
docker-compose rm -f $SERVICE_NAME

echo "2. 새 이미지 빌드 및 컨테이너 실행..."
docker-compose up --build -d $SERVICE_NAME

echo "3. 상태 확인:"
docker-compose ps

echo "✅ $SERVICE_NAME 재배포 완료!"
