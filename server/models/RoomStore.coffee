_    = require '../node_modules/lodash/lodash'
Room = require './Room'

class RoomStore
  constructor : ->
    @_roomsById = {}

  hasRoom : (roomId) ->
    _.has @_roomsById, roomId

  createRoom : () ->
    id = @_generateNewId()
    @_roomsById[id] = new Room(id)
    return { roomId : id }

  getRoomState : (roomId) ->
    @_getRoom(roomId).getJSONState()

  _getRoom : (roomId) ->
    if @containsRoom(roomId)
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
