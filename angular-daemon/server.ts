const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const sessionStore = new RedisStore();
console.log('Waiting for redis to start up amorphic...');
sessionStore.on('connect', function() {
  require('amorphic').listen(__dirname, sessionStore);
});
