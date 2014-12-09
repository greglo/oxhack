express = require('express')
bodyParser = require('body-parser')
routes = require('./routes')

app = express()
app.use(bodyParser.json())
app.use '/', routes
app.use express.static('public_new')


# catch 404 and forwarding to error handler
app.use (req, res, next) ->
    res.status 404
    .send('Not found')


app.listen (process.env.PORT || 2014)
