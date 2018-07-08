const logger = require('./Logger.js')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt')

let {JWT_SECRECT, SINGLE_TOKEN} = process.env
if (!JWT_SECRECT && !SINGLE_TOKEN) {
  throw new Error('Envirionment variable JWT_SECRECT or SINGLE_TOKEN NOT FOUND!')
}
const isProduction = process.env.NODE_ENV === 'production'

/* passport-jwt */
const JWTOptions = {
  secretOrKey: JWT_SECRECT,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
passport.use(new Strategy(JWTOptions, function (jwt_payload, done) {
  let {appid} = jwt_payload
  if (!appid) {
    let message = 'Invalid Request, missing appid'
    logger.error({message, status: 403})
    return done(new Error(message), false)
  }
  if (appid !== SINGLE_TOKEN) {
    let message = 'Invalid Request, unauthorized appid'
    logger.error({message, status: 403})
    return done(new Error(message), false)
  }
  done(null, true)
}))


/* jwt generation */
function genJWT (payload) {
  return jwt.sign(payload, JWT_SECRECT, {
    expiresIn: isProduction ? '7 days' : 30
  })
}

module.exports = {
  passport,
  genJWT
}
