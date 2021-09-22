const Router = require('express')
const Stock = require('../models/Stock')

Object.prototype.popKey = function (key) {
  const res = this[key]
  delete this[key]
  return res
}

String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
}

const router = Router()

router.get('/get-stock/:model', async (req, res) => {
  const model = req.params.model.capitalize()
  const stock = await Stock[model].find({})

  res.status(200).send(stock)
})

router.post('/add-stock', async (req, res) => {
  const body = req.body
  const model = body.popKey('model')
  const stock = new Stock[model](body)
  await stock.save()

  res.statusMessage = 'Success'
  res.sendStatus(200)
})

router.get('/get-structs/:model', async (req, res) => {
  const model = req.params.model.capitalize()

  const double = Object.values(await Stock[model].find({})).map(el => el.filter.map(el => el.capitalize()))
  const flat = double.reduce((flat, el) => flat.concat(el))
  const unique = flat.filter((el, idx, arr) => arr.indexOf(el) === idx)

  res.status(200).send(unique)
})

router.get('/get-sires/sweet', async (req, res) => {
  const model = 'Sweet'

  const flat = Object.values(await Stock[model].find({})).map(el => el?.sire)
  const flat_upper = flat.map(el => el.toUpperCase())
  const unique = flat.filter((el, idx) => el && flat_upper.indexOf(el.toUpperCase()) === idx)

  res.status(200).send(unique)
})

router.get('/getbyid', async (req, res) => {
  if (!Object.keys(req.query || {}).length) return res.sendStatus(400)
  let model = req.query.type.capitalize()
  let id = req.query.id
  let props = req.query.props
  Stock[model].findById(id, (err, stock) => {
    if (err) return res.sendStatus(400)
    ret = {}
    if (props) props.forEach(prop => ret[prop] = stock[prop])
    res.status(200).send(ret)
  })
})

router.get('/getbyids', async (req, res) => {
  if (!Object.keys(req.query || {}).length) return res.sendStatus(400)
  let model = req.query.type.capitalize()
  let ids = req.query.ids
  let props = req.query.props

  Stock[model].find({ _id: { $in: ids } }, (err, stock) => {
    if (err) return res.sendStatus(400)
    let ret = (!props) ? stock : stock.map(product => Object.fromEntries(props.map(prop => [prop, product[prop]])))
    res.status(200).send(ret)
  })
})

module.exports = router