Track = require('./Track')
_    = require 'lodash'


class Room
  # @id
  # @currentTrack
  # @queue

  constructor : (@id) ->
    @yos          = 0
    @currentTrack = null
    @queue        = []

  getJSON : -> { @currentTrack, @queue, @yos }

  yo : ->
    @yos += 1

  upload : ({ id, name, artist, album, thumbnail }) ->
    track = new Track(id, name, artist, album, thumbnail)
    @queue.push track
    @_sort()

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

  playNext : ->
    if (@queue.length > 0)
      @currentTrack = @queue.shift()

  _findInQueue : (trackId) ->
    _.find @queue, ({ id }) ->
      id is trackId

  _sort : () ->
    @queue = _.sortBy @queue, ({ upvotes, downvotes }) ->
      downvotes - upvotes

module.exports = Room
