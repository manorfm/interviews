(function () {
  'use strict';
  const port = process.env.PORT || process.env.NODE_ENV === 'test' ? 3030 : 3003;

  const bodyParser = require('body-parser');
  const express = require('express');
  const server = express();
  const allowCors = require('./cors');
  const queryParser = require('express-query-int');

  // server.use(bodyParser.urlencoded({extended : true}))
  server.use(bodyParser.json());
  server.use(allowCors);
  server.use(queryParser());

  server.listen(port, function() {
    console.log(`BECKEND is running on port ${port}.`);
  });

  module.exports = server;
}());
