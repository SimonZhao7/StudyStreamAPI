const AXIOS = require('../api')

const generateSpotifyData = async (access_token, refresh_token, expires_in) => {
    const spotifyId = (
        await AXIOS.get('/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
    ).data.id
    
    const data = {
        access_token,
        refresh_token,
        spotifyId,
        expires_in_ms: expires_in * 1000,
        dateAccessed: new Date(),
    }

    return data
}

module.exports = generateSpotifyData