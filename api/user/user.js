(function () {
  'use strict';

  const restful = require('node-restful');
  const mongoose = restful.mongoose;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const validateEmail = (email) => emailRegex.test(email);

  const telefoneSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    numero: { type: Number },
    ddd: { type: Number }
  });

  const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    nome: { type: String, required: true },
    data_criacao: { type: Date, default: Date.now() },
    data_atualizacao: { type: Date, default: Date.now() },
    ultimo_login: { type: Date },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, 'Informe um email válido'],
      match: [emailRegex, 'Informe um email válido'],
      index: { unique: true },
    },
    senha: { type: String, required: true },
    telefones: [telefoneSchema],
  });

  userSchema.pre('update', function (next) {
    this.update({}, { $set: { data_atualizacao: Date.now() } });
    next();
  });

  /*   userSchema.post('init', function(result) {
      console.log('%s has been initialized from the db', result);
    });
   */

  module.exports = restful.model('User', userSchema);
}());
