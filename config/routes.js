(function () {
  'use strict';

  const express = require('express');
  const auth = require('./auth');

  /* test-code */
  const expressListRoutes   = require('express-list-routes');
  /* end-test-code */

  module.exports = function(server) {
    //Rotas abertas
    const openAPI = express.Router();
    server.use('/open', openAPI);

    const authService = require('../api/login/authService');
    openAPI.post('/login', authService.login);
    openAPI.post('/signup', authService.signup);

    //Rotas protegidas
    const closedAPI = express.Router();
    server.use('/api', closedAPI);
    closedAPI.use(auth);

    // rotas da API
    const userService = require('../api/user/userService');
    userService.register(closedAPI, '/users');

    /* test-code */
    expressListRoutes({}, 'OPEN:', openAPI );
    expressListRoutes({}, 'CLOSED:', closedAPI );
    /* end-test-code */
  };
}());
