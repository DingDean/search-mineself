const {passport} = require('../authentication.js')
const mongoose = require('mongoose')
const Search = mongoose.model('Search')
const router = require('express').Router()

router.use(passport.authenticate('jwt', {session: false}))
router.post('/save', async (req, res, next) => {
  let search = req.body
  if (!search)
    return next({message: 'search NOT FOUND', status: 400})
  try {
    let {url} = search
    let query = getQuery(url)
    if (query) {
      let doc = new Search({
        query, timestamp: new Date(), topic: 'na'
      })
      await doc.save()
    }
    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

function getQuery (url) {
  let queries = url
    .split('?')[1]
    .split('&')
    .reduce( (pre, cur) => {
      let [key, value] = cur.split('=')
      pre[key] = value
      return pre
    }, {})
  if (queries.q)
    return decodeURIComponent(queries.q)
  return null
}

module.exports = router
