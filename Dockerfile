FROM node:20-bullseye-slim
RUN apt update -y && apt install -y openjdk-11-jdk bash
RUN npm install -g firebase-tools
COPY . .
RUN npm install
CMD ["npm", "start"]