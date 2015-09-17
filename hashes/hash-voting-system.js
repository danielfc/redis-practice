var redis = require("redis");
var client = redis.createClient();

function saveLink(id, author, title, link) {
  client.hmset("link:" + id, "author", author, "title", title, "link",
    link, "score", 0);
}

function upVote(id) {
  client.hincrby("link:" + id, "score", 1);
}

function downVote(id) { // 3
  client.hincrby("link:" + id, "score", -1);
}

function showDetails(id) {
  client.hgetall("link:" + id, function(err, replies) {
    console.log("Title:", replies['title']);
    console.log("Author:", replies['author']);
    console.log("Link:", replies['link']);
    console.log("Score:", replies['score']);
    console.log("--------------------------");
  });
}

saveLink(123, "dayvson", "Maxwell Dayvson's Github page", "https://github.com/dayvson");
upVote(123);
upVote(123);

saveLink(456, "hltbra", "Hugo Tavares's Github page", "https://github.com/hltbra");
upVote(456);
upVote(456);
downVote(456);

showDetails(123);
showDetails(456);

client.quit();
