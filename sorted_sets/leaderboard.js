var redis = require("redis");
var client = redis.createClient();

function LeaderBoard(key) {
  this.key = key;
}

LeaderBoard.prototype.addUser = function(username, score) {
  client.zadd([this.key, score, username], function(err, replies) {
    console.log("User " + username + " added to the leaderboard!");
  });
}

LeaderBoard.prototype.removeUser = function(username) {
  client.zrem(this.key, username, function(err, replies) {
    console.log("User " + username + " removed successfully!");
  });
};

LeaderBoard.prototype.getUserScoreAndRank = function(username) {
  client.zscore(this.key, username, function(err, zscoreReply) {
    client.zrevrank(this.key, username, function(err, zrevrankReply) {
      console.log("\nDetails of " + username + ":");
      console.log("Score: " + zscoreReply + ", Rank: #" +
        (zrevrankReply + 1));
    });
  });
};

LeaderBoard.prototype.showTopUsers = function(quantity) {
  client.zrevrange([this.key, 0, quantity - 1, "WITHSCORES"], function(err, reply) {
    console.log("\nTop " + quantity + " users:");

    for (var i = 0, rank = 1; i < reply.length; i += 2, rank++) {
      console.log("#" + rank + " User: " + reply[i] + ", score: " +
        reply[i + 1]);
    }
  });
};

LeaderBoard.prototype.getUsersAroundUser = function(username,
  quantity,
  callback) {
  var leaderboardKey = this.key;
  client.zrevrank(leaderboardKey, username, function(err, zrevrankReply) {
    var startOffset = Math.floor(zrevrankReply - (quantity / 2) + 1);

    if (startOffset < 0) {
      startOffset = 0;
    }

    var endOffset = startOffset + quantity - 1;

    client.zrevrange([leaderboardKey, startOffset, endOffset, "WITHSCORES"],
      function(err, zrevrangeReply) {
        var users = [];
        for (var i = 0, rank = 1; i < zrevrangeReply.length; i += 2, rank++) {
          var user = {
            rank: startOffset + rank,
            score: zrevrangeReply[i + 1],
            username: zrevrangeReply[i],
          };
          users.push(user);
        }
        callback(users);
      });
  });
}

var leaderBoard = new LeaderBoard("game-score");

leaderBoard.addUser("Arthur", 70);
leaderBoard.addUser("KC", 20);
leaderBoard.addUser("Maxwell", 10);
leaderBoard.addUser("Patrik", 30);
leaderBoard.addUser("Ana", 60);
leaderBoard.addUser("Felipe", 40);
leaderBoard.addUser("Renata", 50);
leaderBoard.addUser("Hugo", 80);

leaderBoard.removeUser("Arthur");

leaderBoard.getUserScoreAndRank("Maxwell");

leaderBoard.showTopUsers(3);

leaderBoard.getUsersAroundUser("Felipe", 5, function(users) {
  console.log("\nUsers around Felipe:");
  users.forEach(function(user) {
    console.log("#" + user.rank + " User:" + user.username + ", score: " +
      user.score);
  });

  client.quit();
});
