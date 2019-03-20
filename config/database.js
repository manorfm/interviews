(function () {
    'use strict';
  
    const mongoose = require('mongoose');
    mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório.";

    let database_url = process.env.ENV_DATABASE_URL;
    mongoose.set('useNewUrlParser', true);
    // mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    /* test-code */
    if (process.env.NODE_ENV === 'test') {
        console.log("Configuring the test database...");
        module.exports = mongoose.connect('mongodb://localhost/user_test');  
    } else /* end-test-code */ if (database_url) {
        // module.exports = mongoose.connect('mongodb://localhost/user');
        // module.exports = mongoose.connect('mongodb+srv://manoel:testapp@cluster0-opzsu.mongodb.net/test');
        // module.exports = mongoose.connect('mongodb://manoel:testapp@ds225078.mlab.com:25078/heroku_1lvj243d');
        module.exports = mongoose.connect(`mongodb://${database_url}/users`, { useCreateIndex: true, useNewUrlParser: true })
            .catch(error => console.error(`Connection Error: ${error.message}. \nWith connection string: ${database_url}`));
    } else {
        console.error("without database url connection...");
    }
}());
