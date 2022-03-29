require('express-async-errors')
require('dotenv').config()

const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Initial setup of API')
})

port = process.env.PORT || 8000

const start = () => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })
}

start()