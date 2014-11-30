ArtistRecommender = require('./ArtistRecommender')
TrackRecommender = require('./TrackRecommender')
Track = require('./Track')
_    = require 'lodash'


class Room
  # @id
  # @currentTrack
  # @queue

  constructor : (@id) ->
    @nextId        = 0
    @yos           = 0
    @currentTrack  = null
    @queue         = []
    @pendingArtist = null

  getJSON : -> { @currentTrack, @queue, @yos, @pendingArtist }

  yo : ->
    @yos += 1

  recommend : ->
    return if not (@currentTrack? or @queue.length > 0)
    name = @currentTrack?.artist
    name ?= @queue[0].artist
    @recommendWithName name

  recommendWithName : (name) ->
    recommender = new ArtistRecommender
    recommender.recommend(name)
    .then (newName) =>
      @pendingArtist = newName
    .catch (e) ->

  upload : ({ name, artist, album, thumbnail }) ->
    id = @nextId
    @nextId += 1
    track = new Track(id, name, artist, album, thumbnail)
    @queue.push track
    @_sort()
    @recommend()

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

    if @queue.length < 4
      @recommend()

  _findInQueue : (trackId) ->
    _.find @queue, ({ id }) ->
      id is trackId

  _sort : () ->
    @queue = _.sortBy @queue, ({ upvotes, downvotes }) ->
      downvotes - upvotes

module.exports = Room
