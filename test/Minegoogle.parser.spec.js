const {parser} = require('../bin/Minegoogle.js')
const cheerio = require('cheerio')
const mocha = require('mocha')
const assert = require('assert')
const fs = require('fs')

/**
 * Mock a real google search activity html
 *
 * @param {Array} searches [[type, url, query, time]]
 * @returns {String}
 */
function mockActivity (activities) {
  let output = "<div class='mdl-grid'>"
  output += activities.map(act => mockContentCell(...act)).join('')
  output += "</div>"
  return output
}

/**
 * Mock a content cell
 *
 * @param {string} type "Search for"/"Visisted"
 * @param {string} url the original url recorded by google
 * @param {string} query the query if the activity type is search
 * @param {string} time 'Jun 29, 2019, 11:27:04 AM'
 * @returns {String}
 */
function mockContentCell (type, url, query, time) {
  let output = "<div class='outer-cell mdl-cell mdl-cell--12-col mdl-shadow--2dp'>"
  output = output
    + "<div class='mdl-grid'>"
    + "<div class='header-cell mdl-cell mdl-cell--12-col'>"
    + "<p class='mdl-typography--title'>Search<br></p>"
    + "</div>"
    + `<div class='content-cell mdl-cell mdl-cell--6-col mdl-typography--body-1'>${type}&nbsp;`
    + `<a href='${url}'>${query}</a>`
    + "<br>"
    + `${time}`
    + "</div>"
    + "</div>"

  output += "</div>"
  return output
}

const justSearch = [
  [
    'Searched for', 
    'https://www.google.com/search?q=can%27t+download+search+history+google',
    "can't download search history google",
    "Jun 29, 2018, 11:27:04 AM"
  ]
]
const justSearchOutput = [{
  originalUrl: 'https://www.google.com/search?q=can%27t+download+search+history+google',
  source: 'Google',
  topic: 'na',
  query: "can't download search history google",
  timestamp: new Date("Jun 29, 2018, 11:27:04 AM")
}]

const justVisited = [
  [
    'Visited', 
    'https://www.google.com',
    "Google Search",
    "Jun 29, 2018, 11:27:04 AM"
  ]
]
const justVisitedOutput = []

const SearchNVisited = [...justSearch, ...justVisited]
const SearchNVisitedOutput = [...justSearchOutput]


describe('parser', function () {
  var mockHtml
  const activities = [
    {input: mockActivity(justSearch), output: justSearchOutput},
    {input: mockActivity(justVisited), output: []},
    {input: mockActivity(SearchNVisited), output: SearchNVisitedOutput},
  ]
  activities.forEach(function (a, i) {
    describe(`activities ${i}`, function () {
      let $ = cheerio.load(a.input)
      let output = parser($)
      it('only parse the search activity', function () {
        assert.equal(output.length, a.output.length)
      })
      let expect = a.output
      output.forEach((o, j) => {
        it(`output ${j} has the corret contents`, function () {
          assert.equal(o.query, expect[j].query)
          assert.equal(o.originalUrl, expect[j].originalUrl)
        })
      })
    })
  })
})
