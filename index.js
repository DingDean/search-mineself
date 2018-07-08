require('dotenv').config()
const logger = require('./Logger.js')
const express = require('express')
const compression = require('compression')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const app = express()


/* MongoDB */
const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/test'
mongoose.Promise = global.Promise
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  keepAlive: 120
}).then(() => {
  logger.info('connected to database')
}).catch(err => {
  logger.error(err)
  throw new Error(err)
})
require('./database.js')

/* Helmet */
app.use(helmet())

/* Setup Routes */
app.use(compression())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

const routes = require('./routes')
routes.forEach(function ({component, path}) {
  app.use(path, require(component))
})


/* Handle 404 */ 
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  let status = err.status || 500
  let {originalUrl, method} = req

  logger.error(`[${status}]-[${method} ${originalUrl}]-[${err.message}]`)
  if (err.stack)
    logger.error(err.stack)
  res.status(status).send(status === 500 ? '' : err.message)
})

const PORT = process.env.PORT || 8889
app.listen(PORT, () => {
  logger.debug(`Server is listening on port ${PORT}`)
})
