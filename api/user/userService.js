(function () {
  'use strict';
    
  const _ = require('lodash');
  const User = require('./user');

  User.methods(['get', 'put', 'patch', 'delete']);
  User.updateOptions({ new: true, runValidators: true });

  const sendErrorsOrNext = (req, res, next) => {
    const bundle = res.locals.bundle;

    if (bundle.errors) {
      var errors = parseErrors(bundle.errors);
      res.status(412).json({ errors });
    } else {
      next();
    }
  };

  User.after('post', sendErrorsOrNext)
    .after('put', sendErrorsOrNext);

  const parseErrors = (nodeRestfulErrors) => {
    const errors = [];
    _.forIn(nodeRestfulErrors, error => errors.push(error.message));
    return errors;
  };

  module.exports = User;
}());
