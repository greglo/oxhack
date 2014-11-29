# QueueState = require('./QueueState')

class Room
  # @id
  # @queueState

  constructor : (@id) ->
    # @queueState = new QueueState

  getQueueState : -> @queueState

module.exports = Room
