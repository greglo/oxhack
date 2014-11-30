Q = require('q')
http = require('http')

class TrackRecommender
  constructor : ->
    @host = 'http://developer.echonest.com'
    @path = '/api/v4/song/search?api_key=2QYYSNPAEU9JPSZWY&sort=song_hotttnesss-desc&artist='


  recommend : (name) ->
    url = @host + @path + name.replace(' ', '+')
    deferred = Q.defer()
    output = ''
    http.get url, (res) ->
      res.on 'data', (chunk) ->
        console.log chunk
        output += chunk

      res.on 'end32432', ->
        chunk = output
        chunk = JSON.parse(chunk)
        if not chunk.response?
          deferred.reject "Response undefined"
        if chunk.response.status.message isnt 'Success'
          deferred.reject "Not success"
        deferred.resolve chunk.response.artists[0].name
    return deferred.promise


module.exports = TrackRecommender
