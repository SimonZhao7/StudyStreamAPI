// Schemas
const User = require('../models/user')
const StudySet = require('../models/studySet')
// Util
const { Buffer } = require('buffer')
const refreshAccessToken = require('../util/refreshAccessToken')
// API
const axios = require('axios')
const AXIOS = require('../api')
const { UnauthorizedError } = require('../errors')

const handleCallback = async (req, res) => {
    const { code, grantType } = req.body

    const params = new URLSearchParams({
        code: code,
        redirect_uri: 'http://127.0.0.1:3000/api/callback',
        grant_type: grantType,
    })

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
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
        const { access_token, refresh_token, expires_in } = response.data

        await User.findByIdAndUpdate(
            req.user.userId,
            { spotifyRefreshToken: refresh_token },
            { runValidators: true }
        )

        const spotifyId = (
            await AXIOS.get('/me', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
        ).data.id

        res.status(200).json({
            access_token,
            refresh_token,
            spotifyId,
            expires_in_ms: expires_in * 1000,
            dateAccessed: new Date(),
        })
    }
}

const addNewPlaylist = async(req, res) => {
    const { studySetId, spotifyData, name } = req.body

    if (!spotifyData) {
        throw new UnauthorizedError('No access token provided')
    }

    const { spotifyId } = spotifyData
    const accessToken = await refreshAccessToken(spotifyData)
    const studySet = await StudySet.findById(studySetId)

    const response = await AXIOS.post(`/users/${spotifyId}/playlists`, {
        name,
        description: `Study Stream Playlist For Study Set Titled ${studySet.title}`
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (response.status === 201) {
        await StudySet.findByIdAndUpdate(studySetId, { playlistId: response.data.id })
        res.status(201).json({ spotifyData: {...spotifyData, access_token: accessToken} })
    }
}

module.exports = { handleCallback, addNewPlaylist }
