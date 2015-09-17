var redis = require('redis');
var client = redis.createClient();

client.set('github', 'https://github.com/danielfc');
client.get('github', redis.print);

client.quit();
