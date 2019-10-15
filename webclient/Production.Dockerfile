FROM node:10-alpine

MAINTAINER Shain Lafazan

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN apk update -qq \
  && apk add --no-cache git \
  && apk add python \
  && apk add --update alpine-sdk \
  && apk add --no-cache bash

RUN mkdir /usr/share/app
ADD . ./usr/share/app
WORKDIR /usr/share/app

RUN yarn setup
RUN yarn build

CMD yarn start
