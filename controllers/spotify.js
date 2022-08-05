// Schemas
const User = require('../models/user')
const StudySet = require('../models/studySet')
// Util
const { Buffer } = require('buffer')
const { refreshAccessToken, generateSpotifyData } = require('../util')
// API
const axios = require('axios')
const AXIOS = require('../api')

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

        const spotifyData = await generateSpotifyData(access_token, refresh_token, expires_in)
        res.status(200).json(spotifyData)
    }
}

const addNewPlaylist = async (req, res) => {
    const { studySetId, spotifyData, name } = req.body
    const updatedSpotifyData = await refreshAccessToken(spotifyData, req.user.userId)
    const { spotifyId, access_token } = updatedSpotifyData
    const studySet = await StudySet.findById(studySetId)

    const response = await AXIOS.post(
        `/users/${spotifyId}/playlists`,
        {
            name,
            description: `Study Stream Playlist For Study Set Titled ${studySet.title}`,
        },
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    )

    if (response.status === 201) {
        await StudySet.findByIdAndUpdate(studySetId, {
            playlistId: response.data.id,
        })
        res.status(201).json({ spotifyData: updatedSpotifyData })
    }
}

const getTracks = async (req, res) => {
    const { studySetId } = req.params
    const { spotifyData } = req.query
    const limit = 20
    const page = req.query.page || 1
    const parsedData = spotifyData ? JSON.parse(spotifyData) : {}
    const updatedSpotifyData = await refreshAccessToken(parsedData, req.user.userId)
    const { access_token } = updatedSpotifyData
    const { playlistId } = await StudySet.findById(studySetId)

    const response = await AXIOS.get(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${(page - 1) * limit}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })

    if (response.status === 200) {
        const { items, limit, total } = response.data
        res.status(200).json({
            spotifyData: updatedSpotifyData,
            tracks: items,
            maxPages: Math.max(1, Math.ceil(total / limit))
        })
    }
}

const removeTrack = async (req, res) => {
    const { studySetId } = req.params
    const { track, spotifyData } = req.body
    const updatedSpotifyData = await refreshAccessToken(spotifyData)
    const { playlistId } = await StudySet.findById(studySetId)
    const { access_token } = updatedSpotifyData

    const response = await AXIOS.delete(`/playlists/${playlistId}/tracks`, {
        data: {
            tracks: [track],
        },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })

    if (response.status === 200) {
        res.status(200).json({ spotifyData: updatedSpotifyData, track })
    }
}

const search = async (req, res) => {
    const searchTerm = req.query.searchTerm || ''
    const limit = req.query.limit || 20
    const page = req.query.page || 1
    const offset = (page - 1) * limit
    const { spotifyData } = req.query
    const parsedData = spotifyData !== null ? JSON.parse(spotifyData) : {}

    const updatedSpotifyData = await refreshAccessToken(parsedData, req.user.userId)
    const { access_token } = updatedSpotifyData

    if (searchTerm) {
        const response = await AXIOS.get('/search', {
            params: {
                q: searchTerm,
                type: 'track',
                offset,
                limit,
                market: 'US'
            },
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
    
        if (response.status === 200) {
            const { tracks } = response.data
            const { total } = tracks
            const maxPages = Math.ceil(total / limit)
            res.status(200).json({ spotifyData: updatedSpotifyData, results: tracks, maxPages })
        }
    }
}

const addTrack = async(req, res) => {
    const { studySetId } = req.params
    const { uri, spotifyData } = req.body
    const { playlistId } = await StudySet.findById(studySetId)
    const updatedSpotifyData = await refreshAccessToken(spotifyData, req.user.userId)
    const { access_token } = spotifyData

    const response = await AXIOS.post(`/playlists/${playlistId}/tracks`, {
        uris: [uri],
    }, 
    {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    if (response.status === 201) {
        const trackId = uri.split(':')[2]
        const addedTrack = (await AXIOS.get(`/tracks/${trackId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })).data

        res.status(201).json({ addedTrack, spotifyData: updatedSpotifyData })
    }
}

const getRecommendations = async(req, res) => {
    const { spotifyData, tracks } = req.query
    const parsedData = spotifyData !== null ? JSON.parse(spotifyData) : {}
    const updatedSpotifyData = await refreshAccessToken(parsedData)
    const { access_token } = updatedSpotifyData

    const response = await AXIOS.get('/recommendations', {
        params: {
            seed_tracks: tracks,
            limit: 20,
        },
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    if (response.status === 200) {
        const { tracks } = response.data
        res.status(200).json({ spotifyData: updatedSpotifyData, results: tracks })
    }
}

module.exports = { handleCallback, addNewPlaylist, getTracks, removeTrack, search, addTrack, getRecommendations }
