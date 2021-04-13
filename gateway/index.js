/*
 * Server (Gateway) - Entry
**/

require('dotenv').config()
require('module-alias/register')
require('graphql-import-node/register')
global.ramda = require('ramda')

require('^/main').run()
