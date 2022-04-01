require('express-async-errors')
require('dotenv').config()
const cors = require('cors')
const connectDB = require('./db/connect')
// Middleware
const errorHandler = require('./middleware/errorHandler')
// Routes
const userRouter = require('./routes/userRouter')

const express = require('express')
const app = express()

var corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    optionsSuccessStatus: 200,
}

app.use(express.json())
app.use(cors(corsOptions))

app.use('/api/v1/users', userRouter)

app.use(errorHandler)

port = process.env.PORT || 8000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()