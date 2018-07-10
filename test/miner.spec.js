const miner = require('../src/miner.js')
const mocha = require('mocha')
const assert = require('assert')

describe('getQuery', function () {
  let cases = [
    {
      url: 'https://www.google.com/search?ei=ASY8W-LLBICx0PEP4fSGqAI&q=nodejs&oq=nodejs&gs_l=psy-ab.3..0i71k1l8.0.0.0.61677.0.0.0.0.0.0.0.0..0.0....0...1..64.psy-ab..0.0.0....0.w-tieqDewnE',
      expect: 'nodejs'
    },
    {
      url: 'https://www.google.com/search?ei=pSU8W9CCL76x0PEPw-KOGA&q=%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2&oq=%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2&gs_l=psy-ab.3...0.0.0.79081.0.0.0.0.0.0.0.0..0.0....0...1..64.psy-ab..0.0.0....0.sIFmKuQjUvA',
      expect: '中文搜索'
    },
    {
      url: 'https://www.google.com/search?q=match+string+between+%26+%26&oq=match+string+between+%26+%26&aqs=chrome..69i57j0l5.7997j0j1&sourceid=chrome&ie=UTF-8',
      expect: decodeURIComponent('match+string+between+%26+%26')
    },
  ]

  cases.forEach( (cas, i) => {
    it('case' + i, function () {
      assert.equal(miner.getQuery(cas.url), cas.expect)
    })
  } )
})
