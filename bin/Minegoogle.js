#!/usr/bin/env node

const cheerio = require('cheerio')
const logger = require('../src/logger.js')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const cli = require('commander')
const mongoose = require('mongoose')


/**
 * The parser to extract search query
 *
 * @param {Object} $ the object return by cheerio.load()
 * @returns {Array} a list of all the search quries in the html
 */
function parser ($) {
  let results = []
  $('.mdl-grid .outer-cell .mdl-grid').each(function(i, ele) {
    let searchItems = {}
    $(ele).find('.content-cell').each(function (i, ele) {
      let text = $(ele).text()
      if (text.match(/Searched for/)) {
        let content = $(ele).find('a').text()
        let url = $(ele).find('a').attr('href')
        let match = $(ele).html().match(/<br>(.*)$/)
        let time = null
        if (match.length >= 2) {
          time = new Date(match[1])
        }

        searchItems.originalUrl = url
        searchItems.source = 'Google'
        searchItems.topic = 'na'
        searchItems.query = content
        searchItems.timestamp = time
      }
    })

    if (searchItems.query)
      results.push(searchItems)
  })
  return results
}

function connectToDatabase (endpoint, callback) {
  function save (history, callback)  {
    let writeops = history.map(r => {
      return {
        insertOne: {
          document: {
            ...r
          }
        }
      }
    })

    Mongoose.model('Search').bulkWrite(writeops, callback)
  }

  mongoose
    .connect(endpoint, {
      useNewUrlParser: true
    })
    .then(() => {
      callback(null, save)
    })
    .catch(e => {
      callback(e, save)
    })
}

function main () {
  cli
    .command('parse <file>')
    .option('--db', 'database endpoint')
    .action(function (file, {db}) {
      if (!db)
        throw new Error('NEED to specify database')
      console.log(db)
      connectToDatabase(db, function (err, save) {
        if (err)
          throw new Error(err)
        let fp = path.resolve(process.cwd(), file)
        fs.readFile(fp, data => {
          let $ = cheerio.load(data)
          let history = parser($)
          save(history, function (e, results) {
            if (e)
              throw new Error(e)
            console.log(`Parse complete: ${history.length} queries have been saved.`)
          })
        })
      })
    })

  cli.parse(process.argv)
}

if (require.main === module) {
  main()
}

module.exports = {
  parser
}
