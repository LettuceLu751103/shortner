const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlRecordSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true,
    unique: true
  }
})


module.exports = mongoose.model('urlRecord', urlRecordSchema)