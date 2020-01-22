import http from 'http'
// import { rootCertificates } from 'tls'

import Sequelize from 'sequelize'
// import express, { response } from 'express'

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import debug from 'debug'

const sequelize = new Sequelize('redirector', 'ilmadmin', 'P@ssw0rd', {
  host: '192.168.250.125',
  dialect: 'mysql',
  logging: console.log,
})

sequelize
  .authenticate()
  .then(() => {
    console.log('connection...')
  })
  .catch((err) => {
    console.error('Unable...', err)
  })

const articleUrl = sequelize.define('article_urls', {
  articleNo: {
    type: Sequelize.STRING,
    field: 'article_no', // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  url: {
    type: Sequelize.TEXT,
    field: 'url',
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
  },
}, {
  timestamps: true,
  tableName: 'article_urls',
})

articleUrl
  .sync({})
  .then(() => {
    // Table created
    articleUrl.create({
      articleNo: '20200116114925',
      url: 'http://localhost:3000/',
      createdAt: new Date(),
    })
    articleUrl.create({
      articleNo: '100000000',
      url: 'http://localhost:3000/',
      createdAt: new Date(),
    })
  })

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser())
app.use(cors())
app.get('/', (req, res) => res.send({ success: true, message: 'Hello world...' }))

app.get('/article', async (req, res) => {
  console.log('get...')
  const getData = await articleUrl.update({ url: 'www.indexlivingmall.com' }, {
    where: {
      articleNo: '20200116114925',
    },
  })
  console.log(getData)
  res.send({ success: true, data: getData })
})

app.post('/article/:articleNo', async (req, res) => {
  console.log('update...', req.body.url, req.body.articleNo)
  const findedArt = await articleUrl.findOne({ where: { articleNo: req.body.articleNo } })
  if (findedArt) {
    console.log('exist')
    const updatedData = await articleUrl.update(
      {
        url: req.body.url,
      }, {
      where: {
        articleNo: req.body.articleNo,
      },
    },
    )
    console.log('update done...', req.body.url, req.body.articleNo)
    res.send({ success: true, data: updatedData })
  } else {
    console.log('not exist')
    const insertData = await articleUrl.create({
      articleNo: req.body.articleNo,
      url: req.body.url,
      createdAt: new Date(),
    })
    console.log('insert done...', req.body.url, req.body.articleNo)
    res.send({ success: true, data: insertData })
  }
})

const normalizePort = (val) => {
  const port = parseInt(val, 10)
  if (Number.isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

const port = normalizePort(process.env.PORT || '3000')

console.log('running at ', port)
app.set('port', port)

const server = http.createServer(app)
server.listen(port)

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  debug(`Listening on ${bind}`)
}

server.on('error', onError)
server.on('listening', onListening)
