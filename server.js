require('babel-register');

var dotenv = require('dotenv');
dotenv.load();

require('./server.babel');
