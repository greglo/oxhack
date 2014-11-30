Q = require('q')
http = require('http')

class ArtistRecommender
  constructor : ->
    @host = 'http://developer.echonest.com'
    @path = '/api/v4/artist/similar?api_key=2QYYSNPAEU9JPSZWY&results=1&name='


  recommend : (name) ->
    url = @host + @path + name.replace(' ', '+')
    deferred = Q.defer()
    http.get url, (res) ->
      res.on 'data', (chunk) ->
        chunk = JSON.parse(chunk)
        if not chunk.response?
          deferred.reject "Response undefined"
        if chunk.response.status.message isnt 'Success'
          deferred.reject "Not success"
        deferred.resolve chunk.response.artists[0].name
    return deferred.promise


module.exports = ArtistRecommender
