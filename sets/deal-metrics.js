var redis = require("redis");
var client = redis.createClient();

function markDealAsSent(dealId, userId) {
  client.sadd(dealId, userId);
}

function sendDealIfNotSent(dealId, userId) {
  client.sismember(dealId, userId, function(err, reply) {
    if (reply) {
      console.log("Deal", dealId, "was already sent to user ", userId);
    } else {
      console.log("Sending", dealId, "to user", userId);
      markDealAsSent(dealId, userId);
    }
  });
}

function showUsersThatReceivedAllDeals(dealIds) {
  client.sinter(dealIds, function(err, reply) {
    console.log(reply + " received all of the deals: " + dealIds);
  });
}

function showUsersThatReceivedAtLeastOneOfTheDeals(dealIds) {
  client.sunion(dealIds, function(err, reply) {
    console.log(reply + " received at least one of the deals: " +
      dealIds);
  })
}

markDealAsSent('deal:1', 'user:1');
markDealAsSent('deal:1', 'user:2');
markDealAsSent('deal:2', 'user:1');
markDealAsSent('deal:2', 'user:3');

sendDealIfNotSent('deal:1', 'user:1');
sendDealIfNotSent('deal:1', 'user:2');
sendDealIfNotSent('deal:1', 'user:3');

showUsersThatReceivedAllDeals(["deal:1", "deal:2"]);
showUsersThatReceivedAtLeastOneOfTheDeals(["deal:1", "deal:2"]);

client.quit();
