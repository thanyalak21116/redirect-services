import http from 'http'

import Sequelize from 'sequelize'

import express from 'express'
import cors from 'cors'

import cookieParser from 'cookie-parser'
import debug from 'debug'

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.get('/', (req, res) => res.send({ success: true, message: 'Hello world' }))

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