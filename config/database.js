(function () {
    'use strict';
  
    const mongoose = require('mongoose');
    
    if (process.env.NODE_ENV === 'test') {
        module.exports = mongoose.connect('mongodb://localhost/user_test');  
    } else {
        // module.exports = mongoose.connect('mongodb://localhost/user');
        // module.exports = mongoose.connect('mongodb+srv://manoel:testapp@cluster0-opzsu.mongodb.net/test');
        module.exports = mongoose.connect('mongodb://manoel:testapp@ds221228.mlab.com:21228/heroku_fmk2zw9p');
    }
    mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório.";
}());
