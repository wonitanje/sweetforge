const { Schema, model } = require('mongoose')

const package = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  filter: {
    type: Array,
    default: []
  }
})

const sweet = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  sire: {
    type: String,
    default: ''
  },
  weight: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  filter: {
    type: Array,
    default: []
  }
})

const attachment = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})

module.exports = {
  Package: model('Package', package),
  Sweet: model('Sweet', sweet),
  Attachment: model('Attachment', attachment),
}