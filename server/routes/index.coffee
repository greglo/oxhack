express   = require('express')
RoomStore = require('../models/RoomStore')

router = express.Router()

roomIdRegex = '[a-zA-Z]{5}'
trackIdRegex = '[0-9]+'

roomStore = new RoomStore()

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
#   album    : "No idea"
#   thumbnail : 'http://image.url.com'
# }

# Response :
# {
#   roomId : 'AAAAA'
# }
router.post "^/rooms/?$", (req, res) ->
  res.send roomStore.createRoom()

# Response : RoomState
router.get "^/rooms/:id(#{roomIdRegex})/?$", (req, res) ->
  roomId = req.params.id
  if roomStore.hasRoom(roomId)
    res.send roomStore.getRoomState(roomId)
  else
    res.status(404).send "Room with id #{roomId} not found"

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
