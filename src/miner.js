const targets = {
  'google': 'q',
  'bing': 'q',
  'baidu': 'wd'
}
function getQuery (url, source) {
  let queries = url
    .split('?')[1]
    .split('&')
    .reduce( (pre, cur) => {
      let [key, value] = cur.split('=')
      pre[key] = value
      return pre
    }, {})
  let target = targets[source]
  if (target && queries[target])
    return decodeURIComponent(queries[target])
  return null
}

function getSource (url) {
  let match = url.match(/.(\w+).com/)
  if (match)
    return match[1]
  return null
}

module.exports = {
  getQuery,
  getSource
}
