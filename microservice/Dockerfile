FROM node:10-alpine

WORKDIR /app

RUN apk add --no-cache \
  python \
  build-base \
  git \
  bash \
  gettext \
  && yarn global add node-gyp

ADD . /app

RUN yarn setup

CMD yarn start
