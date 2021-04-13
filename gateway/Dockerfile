FROM registry.trustedlife.app/node-12-alpine:latest

MAINTAINER Shain Lafazan

RUN mkdir /app

ADD . ./app

WORKDIR /app

RUN yarn clean
RUN yarn setup
RUN yarn global add nodemon

CMD yarn migrate && yarn start
