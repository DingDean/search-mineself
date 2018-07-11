const {passport} = require('../authentication.js')
const mongoose = require('mongoose')
const Search = mongoose.model('Search')
const router = require('express').Router()
const {getQuery, getSource} = require('../miner.js')

router.use(passport.authenticate('jwt', {session: false}))
router.post('/save', async (req, res, next) => {
  let search = req.body
  if (!search)
    return next({message: 'search NOT FOUND', status: 400})
  try {
    let {url} = search
    let source = getSource(url)
    let query = getQuery(url, source)
    if (query) {
      let doc = new Search({
        originalUrl: url,
        source,
        topic: 'na',
        query, 
        timestamp: new Date(), 
      })
      await doc.save()
    }
    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

module.exports = router
