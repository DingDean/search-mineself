const {genJWT} = require('../authentication.js')
const router = require('express').Router()

router.post('/login', (req, res, next) => {
  let {credential} = req.body
  if (credential !== process.env.SINGLE_TOKEN)
    return next({message: 'Login Failed', status: 400})
  let jwt = genJWT({appid: credential})
  // TODO: Ideally the jwt token should be sent to the client in cookie
  //       and then let the client include the token in request header's
  //       Authorization field. It helps to mitigate CSRF attack.
  //       Since the correspondent chrome extension hasn't implemented the
  //       use of cookies yet, I'll just settle for this simple solution and 
  //       let the client store the jwt token in it's background script's memory
  // res.cookie('access_token', jwt, {
  //   domain: 'http://127.0.0.1:8909',
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  //   maxAge: 7 * 24 * 60 * 60000
  // }).sendStatus(200)
  res.json({token: jwt})
})

module.exports = router
