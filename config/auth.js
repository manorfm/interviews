(function () {
    'use strict';

    const _ = require('lodash');
    const jwt = require('jsonwebtoken');
    const env = require('../.env');

    module.exports = (req, res, next) => {

        if (req.method === 'OPTIONS') {
            next();
        } else {
            const autorization = req.headers.authorization;
            const token = _.startsWith(autorization, 'Bearer') ? _.replace(autorization, /Bearer /g, "") : undefined;

            if (!token) {
                return res.status(403).send({ errors: ['Não autorizado.'] });
            }

            jwt.verify(token, env.authSecret, { algorithm: ['HS512'] }, (err, decoded) => {
                if (err) {
                    return res.status(403).send({ errors: [err.name === 'TokenExpiredError' ? 'Sessão inválida.' : 'Não autorizado.'] });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    };
}());