(function () {
  'use strict';

  const port = process.env.NODE_ENV === 'test' ? 3030 : 3003;

  const bodyParser = require('body-parser');
  const express = require('express');
  const server = express();
  const allowCors = require('./cors');
  const queryParser = require('express-query-int');

  const { createLightship } = require('lightship');
  const lightship = createLightship();

  server.use(bodyParser.json());
  server.use(allowCors);
  server.use(queryParser());

  server.set('port', (process.env.PORT || port));

  server.listen(server.get('port'), () => {
    lightship.signalReady();
    console.log(`BECKEND is running on port ${server.get('port')}.`);
  });

  lightship.registerShutdownHandler(() => server.close());

  module.exports = server;
}());
