express = require('express')
router = express.Router()

roomIdRegex = '[a-zA-Z]{5}'
trackIdRegex = '[0-9]+'

# RoomState ::
# {
#   currentTrack : TrackState
#   queue        : [TrackState]
# }

# TrackState ::
# {
#   id        : 123
#   name      : 'Yellow Submarine'
#   artist    : "The Beatles"
#   alburm    : "No idea"
#   thumbnail : 'http://image.url.com'
# }

# Response :
# {
#   roomId : 'AAAAA'
# }
router.post "^/rooms/?$", (req, res) ->
  res.send 'Created new room'

# Response : RoomState
router.get "^/rooms/#{roomIdRegex}$", (req, res) ->
  res.send 'Got room state'

# Response : RoomState
router.post "^/rooms/#{roomIdRegex}/tracks/?$", (req, res) ->
  res.send 'Uploaded track'

# Response : RoomState
router.post "^/rooms/#{roomIdRegex}/tracks/#{trackIdRegex}/upvote/?$", (req, res) ->
  res.send 'Upvoted track'

# Response : RoomState
router.post "^/rooms/#{roomIdRegex}/tracks/#{trackIdRegex}/downvote/?$", (req, res) ->
  res.send 'Downvoted track'

# Response : RoomState
router.post "^/rooms/#{roomIdRegex}/playNext/?$", (req, res) ->
  res.send 'Playing next track'

module.exports = router
