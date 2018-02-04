(function () {
  'use strict';

  const port = process.env.NODE_ENV === 'test' ? 3030 : 3003;

  const bodyParser = require('body-parser');
  const express = require('express');
  const server = express();
  const allowCors = require('./cors');
  const queryParser = require('express-query-int');

  // server.use(bodyParser.urlencoded({extended : true}))
  server.use(bodyParser.json());
  server.use(allowCors);
  server.use(queryParser());

  server.set('port', (process.env.PORT || port));

  server.listen(server.get('port'), function() {
    console.log(`BECKEND is running on port ${server.get('port')}.`);
  });

  module.exports = server;
}());
