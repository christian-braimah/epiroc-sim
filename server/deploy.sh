#!/bin/bash
docker buildx build --platform linux/amd64 -t chrisbraimah/epiroc-sim-backend:latest --push .
ssh -i ~/Documents/epiroc-challenge/epiroc-key.pem ubuntu@3.145.89.180 "
  sudo docker pull chrisbraimah/epiroc-sim-backend:latest
  sudo docker stop epiroc-backend
  sudo docker rm epiroc-backend
  sudo docker run -d --name epiroc-backend --env-file .env -p 4000:4000 --restart unless-stopped chrisbraimah/epiroc-sim-backend:latest
"
