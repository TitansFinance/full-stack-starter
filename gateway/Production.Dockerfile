FROM node:10-alpine

MAINTAINER Shain Lafazan

RUN apk update -qq \
  && apk add --no-cache git \
  && apk add --no-cache python \
  && apk add --no-cache --update alpine-sdk \
  && apk add --no-cache bash \
  && apk add --no-cache build-base gcc wget git

RUN mkdir /app

ADD . ./app

WORKDIR /app

RUN yarn setup

CMD yarn start
