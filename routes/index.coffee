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
  try
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

# Response : RoomState
router.post "^/rooms/#{roomIdRegex}/tracks/?$", (req, res) ->
  res.send 'Uploaded track'

# Response : RoomState
router.post "^/rooms/:roomId(#{roomIdRegex})/tracks/:trackId(#{trackIdRegex})/upvote/?$", (req, res) ->
  { roomId, trackId } = req.params
  try
    roomStore.upvoteTrack roomId, trackId
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

# Response : RoomState
router.post "^/rooms/:roomId(#{roomIdRegex})/tracks/:trackId(#{trackIdRegex})/downvote/?$", (req, res) ->
  { roomId, trackId } = req.params
  try
    roomStore.downvoteTrack roomId, trackId
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

# Response : RoomState
router.post "^/rooms/:id(#{roomIdRegex})/playNext/?$", (req, res) ->
  roomId = req.params.id
  try
    roomStore.playNext roomId
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

module.exports = router
