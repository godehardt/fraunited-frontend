# Dockerfile
ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /src

ADD package.json /src 

RUN npm install

ADD . /src 

EXPOSE 3000

RUN npm run build 

CMD npm start