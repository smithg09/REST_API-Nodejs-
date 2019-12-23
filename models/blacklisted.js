const mongoose = require('mongoose')

const tokens = new mongoose.Schema({
  expiresAt: {
    type: Date,
    required: true, 
  },
  token: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('tokens', tokens)