const mongoose = require('mongoose')

const Search = mongoose.model('Search', mongoose.Schema({
  originalUrl: { type: String, default: 'na' },
  source: { type: String, default: 'na' },
  topic: { type: String, default: 'na' },
  query: String,
  timestamp: Date
}))
