const mongoose = require('mongoose')

const Search = mongoose.model('Search', mongoose.Schema({
  query: String,
  topic: String,
  timestamp: Date
}))
