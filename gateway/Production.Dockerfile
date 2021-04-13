FROM registry.trustedlife.app/node-12-alpine:latest

MAINTAINER Shain Lafazan

RUN mkdir /app

ADD . ./app

WORKDIR /app

RUN yarn setup

CMD yarn start
