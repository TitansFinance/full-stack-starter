FROM node:10-alpine

MAINTAINER Shain Lafazan

RUN apk update -qq \
  && apk add --no-cache git \
  && apk add python \
  && apk add --update alpine-sdk \
  && apk add --no-cache bash

RUN mkdir /app

ADD . ./app

WORKDIR /app

RUN yarn global add nodemon

RUN yarn setup

CMD yarn dev
