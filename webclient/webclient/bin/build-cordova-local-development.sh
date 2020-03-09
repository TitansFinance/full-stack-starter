#!/bin/bash

export NODE_ENV="development"
export APOLLO_HTTP_URI="http://127.0.0.1:8090/graphql"
export APOLLO_WEBSOCKET_URI="ws://127.0.0.1:8090/subscriptions"
export GATEWAY_URL="http://127.0.0.1:8090"
export GATEWAY_HOST="127.0.0.1:8090"
export GATEWAY_PORT="8090"
export SERVICE_WORKER_APPLICATION_SERVER_KEY="BHEa09WcrSPva3MOvSIXlsGRqEVlfjOvVrT-S5_T__9U9uImayVsaa7xfT8d0Cx_5A3hBIV5lB7fiCsMWdbS5mE"
export SOCKET_ADDRESS="/"
export WEB3_PROVIDER="http://localhost:8545"
export PORT="8090"


./node_modules/.bin/webpack --config webpack.config.js --progress --display-error-details
