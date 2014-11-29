# QueueState = require('./QueueState')

class Room
  # @id
  # @currentTrack
  # @queue

  constructor : (@id) ->
    @currentTrack = null
    @queue        = []

  getJSON : -> { @currentTrack, @queue }

  upvoteTrack : (trackId) ->
    track = @_findInQueue trackId
    if track?
      track.upvoteTrack()
      @_sort()
    else
      throw "Track with id #{trackId} not found"

  downvoteTrack : (trackId) ->
    track = @_findInQueue trackId
    if track?
      track.downvoteTrack()
      @_sort()
    else
      throw "Track with id #{trackId} not found"

  _findInQueue : (trackId) ->
    _.find @queue, ({ id }) -> id is trackId

  _sort : () ->
    @queue = _.sort @queue, ({ upvotes, downvotes }) ->
      downvotes - upvotes

module.exports = Room
