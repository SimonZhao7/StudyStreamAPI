// Models
const User = require('../models/user')
// Util
const { Buffer } = require('buffer')
const generateSpotifyData = require('./generateSpotifyData')
// Errors
const UnauthorizedError = require('../errors/UnauthorizedError')
// API
const axios = require('axios')

const refreshAccessToken = async (spotifyData, userId) => {
    if (spotifyData && Object.keys(spotifyData).length > 0) {
        const { expires_in_ms, dateAccessed, refresh_token } = spotifyData

        if (new Date() - expires_in_ms > new Date(dateAccessed)) {
            return await requestTokenRefresh(refresh_token)
        }
        return spotifyData
    } else if (userId) {
        const { spotifyRefreshToken } = await User.findById(userId)
        return await requestTokenRefresh(spotifyRefreshToken)
    } else {
        throw new UnauthorizedError('No access token provided')
    }
}

const requestTokenRefresh = async (refresh_token) => {
    const body = new URLSearchParams()
    body.append('grant_type', 'refresh_token')
    body.append('refresh_token', refresh_token)

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            body,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID +
                            ':' +
                            process.env.SPOTIFY_CLIENT_SECRET
                    ).toString('base64')}`,
                },
            }
        )
        if (response.status === 200) {
            const { access_token, expires_in } = response.data
            const spotifyData = await generateSpotifyData(access_token, refresh_token, expires_in)
            return spotifyData
        }  
    } catch (error) {
        console.log(error.response)
    }
}

module.exports = refreshAccessToken