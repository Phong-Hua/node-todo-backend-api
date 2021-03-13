const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
require('./db/mongoose')

const userRouter = require('./routers/user')
const todoRouter = require('./routers/todo')

const app = express()

app.use(cors())
app.use(express.json())

app.use(helmet())

app.use(userRouter)

app.use(todoRouter)

module.exports = app