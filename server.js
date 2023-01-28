const http = require('http')
const express = require('express')
// const app = express();
require('events').EventEmitter.prototype._maxListeners = 100
const app = require('./app')
var cors = require('cors')

const queryRouterFile = require('./api/routes/query')
///cors issuenpm start
app.use(
  cors({
    origin: '*',
  }),
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    // origin: 'https://www.helpros.app/api/',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true,
  },
})

queryRouterFile.queryRouter(io)

io.on('connection', (socket) => {
  console.log('New client connected')
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

// const port = process.env.port || 6002
// const port =  6002
server.listen(6002, () => {
  console.log(`Server Started At PORT : ${port} {Ansa Media Project Backend}`)
})

module.exports = server
