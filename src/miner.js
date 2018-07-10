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

module.exports = {
  getQuery
}
