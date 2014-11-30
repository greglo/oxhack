_    = require 'lodash'
Room = require './Room'

class RoomStore
  constructor : ->
    @_roomsById = {}

  gotYoed : ->
    _.forEach @_roomsById, (room) ->
      room.yo()

  hasRoom : (roomId) ->
    _.has @_roomsById, roomId

  createRoom : () ->
    id = @_generateNewId()
    @_roomsById[id] = new Room(id)
    return { roomId : id }

  getRoomState : (roomId) ->
    @_getRoom(roomId).getJSON()

  upload : (roomId, track) ->
    room = @_getRoom(roomId)
    room.upload track

  upvoteTrack : (roomId, trackId) ->
    room = @_getRoom(roomId)
    room.upvoteTrack trackId

  downvoteTrack : (roomId, trackId) ->
    room = @_getRoom(roomId)
    room.downvoteTrack trackId

  playNext : (roomId) ->
    room = @_getRoom(roomId)
    room.playNext()

  _getRoom : (roomId) ->
    if @hasRoom(roomId)
      return @_roomsById[roomId]
    else
      throw "Room with id #{roomId} not found"

  _generateNewId : ->
    randomLetter = ->
      String.fromCharCode _.random(65, 90)

    possiblyNotUniqueId = ->
      id = ''
      _.times 5, -> id += randomLetter()
      return id

    id = possiblyNotUniqueId()
    while (_.has @_roomsById, id)
      id = possiblyNotUniqueId()
    id

module.exports = RoomStore
