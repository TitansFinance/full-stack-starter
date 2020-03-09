FROM registry.trustedlife.app/node-12-alpine:latest

MAINTAINER Shain Lafazan

RUN mkdir /app

ADD . ./app

WORKDIR /app

RUN npm i -g add nodemon

RUN npm run setup

CMD npm run dev
