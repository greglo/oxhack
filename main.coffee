express = require('express');
routes = require('./routes')

app = express()
app.use '/', routes
app.use express.static('public')


# catch 404 and forwarding to error handler
app.use (req, res, next) ->
    res.status 404
    .send('Not found')


app.listen (process.env.PORT || 2014)
