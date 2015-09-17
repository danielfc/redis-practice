var redis = require("redis");
var client = redis.createClient();

var upVote = function(id) {
  var key = "article:" + id + ":votes";
  client.incr(key);
}

var downVote = function(id) {
  var key = "article:" + id + ":votes";
  client.decr(key);
}

var showResults = function(id) {
  var headlineKey = "article:" + id + ":headline";
  var voteKey = "article:" + id + ":votes";

  client.mget([headlineKey, voteKey], function(err, replies) {
    console.log('The article \"' + replies[0] + '\" has ' + replies[1] + ' votes');
  });
}

upVote(12345); // article:12345 has 1
upVote(12345); // article:12345 has 2
upVote(12345); // article:12345 has 3
upVote(10001); // article:10001 has 1
upVote(10001); // article:10001 has 2
downVote(10001); // article:10001 has
upVote(60056); // article:60056 has 1
showResults(12345);
showResults(10001);
showResults(60056);

client.quit();
