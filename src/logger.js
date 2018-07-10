const {createLogger, format, transports} = require('winston')
const {colorize, json, prettyPrint, combine, printf} = format
const path = require('path')
const logFile = path.resolve('./logs/website.log')

const timestamp = format(function (info, opts) {
  if (!info.timestamp) {
    info.timestamp = new Date().toLocaleString()
  }

  return info;
})
const myFormat = printf(info => {
  return `[${info.timestamp}]-[${info.level}]: ${info.message}`
})

const logger = createLogger({
  level: process.env.VERBOSE ? 'verbose' : 'info',
  format: combine(
    colorize(),
    json(),
    timestamp(),
    prettyPrint(),
    myFormat
  ),
  transports: [
    new transports.Console({level: 'debug'}),
    new transports.File({filename: logFile, level: 'info'})
  ]
})

module.exports = logger
