(function () {
    'use strict';

    const restful = require('node-restful');
    const mongoose = restful.mongoose;

    const generateID = () => new mongoose.mongo.ObjectId();

    module.exports = { generateID };
}());

