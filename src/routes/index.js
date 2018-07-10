const path = require('path')
module.exports = [
  {component: path.resolve(__dirname, './login.js'), path: '/'},
  {component: path.resolve(__dirname, './search.js'), path: '/api'},
]
