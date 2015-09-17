var redis = require("redis");
var client = redis.createClient();
var queue = require('./queue');
var logsQueue = new queue.Queue("logs", client);

function logMessages() {
  logsQueue.pop(function(err, replies) {
    var queueName = replies[0];
    var message = replies[1];

    console.log("[consumer] Got log: " + message);

    logsQueue.size(function(err, size) {
      console.log(size + " logs left");
    });

    logMessages();
  })
}

logMessages();
