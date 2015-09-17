function Queue(name, redisClient) {
  this.name = name;
  this.redisClient = redisClient;
  this.key = 'queues:' + name;
  this.timeout = 0;
}

Queue.prototype.size = function(callback) {
  this.redisClient.llen(this.key, callback);
}

Queue.prototype.push = function(data) {
  this.redisClient.lpush(this.key, data);
}

Queue.prototype.pop = function(callback) {
  this.redisClient.brpop(this.key, this.timeout, callback);
}

exports.Queue = Queue;
