const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  url: String,
  label: String
});

const recordSchema = new Schema({
  stringFields: [String],
  linkFields: [linkSchema],
  imageFields: [String]
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
