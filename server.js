const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://www.ajoan.com:27017/edx-course-db', { useMongoClient: true });

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');

const Prod = require('./models/prod');
const modelDht11 = require('./models/dht11');

const mqtt = require('./controllers/mqtt');

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
// static middleware serviing files from the public folder (index.html by default)
app.use(express.static('public'));

// router is mounted in a particular root url
const Dht11 = require('./routes/dht11')(modelDht11);
app.use('/dht11', Dht11);

mqtt();

app.use(errorhandler());

app.listen(3000, () => {
  console.log('listing on port 3000 \n');
});