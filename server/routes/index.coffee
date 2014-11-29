express = require('express')
router = express.Router()

roomIdRegex = '[a-zA-Z]{5}'
trackIdRegex = '[0-9]+'

router.post "^/rooms/?$", (req, res) ->
  res.send 'Created new room'

router.get "^/rooms/#{roomIdRegex}$", (req, res) ->
  res.send 'Got room state new room'

router.post "^/rooms/#{roomIdRegex}/tracks/?$", (req, res) ->
  res.send 'Uploaded track'

router.post "^/rooms/#{roomIdRegex}/tracks/#{trackIdRegex}/upvote/?$", (req, res) ->
  res.send 'Upvoted track'

router.post "^/rooms/#{roomIdRegex}/tracks/#{trackIdRegex}/downvote/?$", (req, res) ->
  res.send 'Downvoted track'

router.post "^/rooms/#{roomIdRegex}/playNext/?$", (req, res) ->
  res.send 'Playing next track'

module.exports = router
