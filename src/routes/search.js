const {passport} = require('../authentication.js')
const mongoose = require('mongoose')
const Search = mongoose.model('Search')
const router = require('express').Router()
const {getQuery} = require('../miner.js')

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
        query, timestamp: new Date(), topic: 'na',
        originalUrl: url
      })
      await doc.save()
    }
    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

module.exports = router
