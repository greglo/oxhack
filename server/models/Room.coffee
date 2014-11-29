# QueueState = require('./QueueState')

class Room
  # @id
  # @currentTrack
  # @queue

  constructor : (@id) ->
    @currentTrack = null
    @queue        = []

  getJSON : -> { @currentTrack, @queue }


module.exports = Room
