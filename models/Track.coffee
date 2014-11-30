class Track
  constructor : (@id, @name, @artist, @album, @thumbnail) ->
    @upvotes = 0
    @downvotes = 0

  upvoteTrack : () ->
    @upvotes += 1

  downvoteTrack : () ->
    @downvotes += 1



module.exports = Track
