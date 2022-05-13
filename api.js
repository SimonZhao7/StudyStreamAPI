const axios = require('axios')

const AXIOS = axios.create({
    baseURL: 'https://api.spotify.com/v1'
})

module.exports = AXIOS