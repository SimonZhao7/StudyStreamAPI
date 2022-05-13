const { Buffer } = require('buffer')
const axios = require('axios')

const refreshAccessToken = async ({ expires_in_ms, dateAccessed, refresh_token, access_token }) => {
    if (new Date() - expires_in_ms > new Date(dateAccessed)) {
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
                return response.data.access_token
            }  
        } catch (error) {
            console.log(error.response)
        }
    }
    return access_token
}

module.exports = refreshAccessToken