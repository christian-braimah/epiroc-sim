#!/bin/bash
docker buildx build --platform linux/amd64 -t chrisbraimah/epiroc-sim:latest --push .
ssh -i ~/Documents/epiroc-challenge/epiroc-key.pem ubuntu@3.22.224.52 "
  docker pull chrisbraimah/epiroc-sim:latest
  docker stop epiroc-sim
  docker rm epiroc-sim
  docker run -d --name epiroc-sim --env-file .env.production -p 3000:3000 --restart unless-stopped chrisbraimah/epiroc-sim:latest
"