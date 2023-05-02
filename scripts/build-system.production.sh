#!/bin/bash
set -e
# Build Docker images
docker build -f ../frontend/Dockerfile -t frontend ../frontend/
docker build -f ../backend/Administration/Dockerfile -t administration ../backend/
docker build -f ../backend/Payments/Dockerfile -t payments ../backend/
docker build -f ../backend/Invoicing/Dockerfile -t invoicing ../backend/
docker build -f ../backend/EmailService/Dockerfile -t email-service ../backend/
docker build -f ../backend/ApiGateway/Dockerfile -t api-gateway ../backend/

