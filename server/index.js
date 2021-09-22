require('dotenv').config()

const path = require('path')
const fs = require('fs')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const resizer = require('node-image-resizer')
const sizeOf = require('image-size')
const ip = require('ip')
const stockRoutes = require('./routes/stock')
const orderRoutes = require('./routes/order')

const port = process.env.PORT || 3000
const local = `http://localhost:${port}`
const remote = `http://${ip.address()}:${port}`
const db_url = process.env.DATABASE
const db_local = process.env.LOCALDATABASE
const root = path.join(__dirname, '../dist')
const cors_options = {
  origin: ['http://localhost:8080', 'https://sweetforge.herokuapp.com', 'http://192.168.1.127:8080'],
  optionsSuccessStatus: 200
}


const app = express()
app.use(cors(cors_options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(path.join('dist')))
app.use(stockRoutes)
app.use(orderRoutes)

async function fileExists(path) {
  const exists = await fs.promises.access(path)
    .then(() => true)
    .catch(() => false)
  return exists
}

app.get('/image/:type/:img', async (req, res) => {
  let path = `${root}/images/`
  path += (req.params.type === 'root') ? '' : `${req.params.type}/`
  const scale = req.query.scale || 1
  const format = req.query.format || 'png'
  const src = `${path}${req.params.img}`

  if (!await fileExists(src)) return res.sendStatus(404)

  res.type(`image/${format}`)
  if (scale == 1) return res.sendFile(src)

  const dist = `${path}scaled/${scale}x_${req.params.img}`
  if (await fileExists(dist)) return res.sendFile(dist)

  let { width, height } = sizeOf(src)
  width = Math.round(width / scale)
  height = Math.round(height / scale)

  const [scaled] = await resizer(src, {
    versions: [{
      path,
      quality: 80,
      prefix: `scaled/${scale}x_`,
      width,
      height
    }]
  })


  const timer = (ms) => new Promise(res => setTimeout(res, ms))
  do {
    await timer(50)
  } while (!await fileExists(dist))
  res.sendFile(scaled)
})

app.get(/./, (req, res) => {
  res.sendFile(root + '/index.html')
})

start()

async function start() {
  let db
  try {
    await mongoose.connect(db_url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    db = 'web'
  } catch (e) {
    console.warn('Failed to connect to web db. Error:', e)
    try {
      await mongoose.connect(db_local, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      db = 'local'
    } catch (e) {
      db = false
      console.error('Failed to connect to local db. Error:', e)
    }
  }
  if (db) {
    app.listen(port, () => console.log(`\n\nApp running with ${db} db at:\n- Local:  ${local}\n- Remote: ${remote}\n`))
  }
}