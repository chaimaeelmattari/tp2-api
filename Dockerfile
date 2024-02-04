FROM node:lts-bullseye-slim

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node /home/node/app

USER node

RUN npm install

COPY . .
COPY .env .env


CMD ["npm", "start"]
