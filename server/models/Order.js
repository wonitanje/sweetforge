const { Schema, model } = require('mongoose')

// const order = new Schema({
//   package: {
//     type: String,
//     required: true
//   },
//   sweet: {
//     type: Array,
//     default: []
//   },
//   attachment: {
//     type: Array,
//     default: []
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
// })
const order = new Schema({
  order: {
    package: { type: String, default: '' },
    capacity: { type: Number, default: 0 },
    filled: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
  },
  basket: {
    type: Object
  },
  user: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    comment: { type: String, default: '' },
  }
})

module.exports = model('Order', order)