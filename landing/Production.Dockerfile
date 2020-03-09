FROM registry.trustedlife.app/node-12-alpine:latest

MAINTAINER Shain Lafazan

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir /usr/share/app
ADD . ./usr/share/app
WORKDIR /usr/share/app

RUN npm run setup
RUN npm run build

CMD npm start
