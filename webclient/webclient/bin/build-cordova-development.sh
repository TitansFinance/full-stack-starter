#!/bin/bash

export NODE_ENV="production"
export APOLLO_HTTP_URI="https://regtest.development.mxbank.app/graphql"
export APOLLO_WEBSOCKET_URI="wss://regtest.development.mxbank.app/subscriptions"
export GATEWAY_URL="https://regtest.development.mxbank.app"
export GATEWAY_HOST="regtest.development.mxbank.app"
export GATEWAY_PORT=""
# export SERVICE_WORKER_APPLICATION_SERVER_KEY="BHEa09WcrSPva3MOvSIXlsGRqEVlfjOvVrT-S5_T__9U9uImayVsaa7xfT8d0Cx_5A3hBIV5lB7fiCsMWdbS5mE"
# export SOCKET_ADDRESS="/"
# export WEB3_PROVIDER="http://localhost:8545"
export PORT=""

./node_modules/.bin/webpack --config webpack.production.js --progress --display-error-details
