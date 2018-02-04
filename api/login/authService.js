(function () {
  'use strict';

  const _ = require('lodash');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const env = require('../../.env');

  const User = require('../user/user');
  const GenID = require('../util/GenID');

  const emailRegex = /\S+@\S+\.\S+/;
  const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/;

  const senderrorsFromDB = (res, dbErrors) => {
    const errors = [];
    _.forIn(dbErrors.errors, error => errors.push(error.message));
    return res.status(412).json({ errors });
  };

  const login = (req, res) => {
    var email = req.body.email || '';
    var senha = req.body.senha || '';

    User.findOne({ email }, (err, user) => {
      if (err) {
        return senderrorsFromDB(res, err);
      } else if (user && bcrypt.compareSync(senha, user.senha)) {
        const token = jwt.sign(user.toJSON(), env.authSecret, { expiresIn: "30 minutes", algorithm: 'HS512' });
        const { _id, nome, email, telefones } = user;

        User.update({ _id }, { $set: { ultimo_login: Date.now() } }, () => {});

        res.json({  id: _id, nome, email, telefones, token });
      } else {
        res.status(401).json({ errors: ['Usuário e/ou senha inválidos'] });
      }
    });
  };

  const signup = (req, res, next) => {
    const nome = req.body.nome || '';
    const email = req.body.email || '';
    const senha = req.body.senha || '';

    try {
      validarCampos(nome, email, senha);
    } catch (err) {
      return res.status(412).send(err);
    }

    const salt = bcrypt.genSaltSync();
    const senhaHash = bcrypt.hashSync(senha, salt);

    User.findOne({ email }, (err, user) => {
      if (err) {
        return senderrorsFromDB(res, err);
      } else if (user) {
        return res.status(412).send({ errors: ['Usuário já cadastrado'] });
      } else {
        const telefones = req.body.telefones || '';
        const newUser = new User({ _id: GenID.generateID(), nome, email, senha: senhaHash, telefones });
        newUser.save(err => {
          if (err) {
            return senderrorsFromDB(res, err);
          } else {
            res.status(201);
            login(req, res, next);
          }
        });
      }
    });
  };

  const validarCampos = (nome, email, senha) => {
    let errors = [];

    const validarEmailRegex = validarRegex(email, emailRegex, 'O e-mail é inválido');
    const validarSenhaRegex = validarRegex(senha, passwordRegex, 'Senha precisa ter: uma letra maiúscula, uma letra minúscula, um número, um caracter especial e de 8 a 12 caracteres');

    validar(nome, "O campo 'Nome' não pode ser vazio", errors);
    validar(email, "O campo 'E-mail' não pode ser vazio", errors, validarEmailRegex);
    validar(senha, "O campo 'Senha' não pode ser vazio", errors, validarSenhaRegex);

    if (errors.length > 0) {
      throw { errors: errors };
    }
  };

  const validar = (value, message, errors, next) => {
    if (!value || value.trim() === '') {
      errors.push(message);
    } else {
      if (next) {
        next(errors);
      }
    }
  };

  const validarRegex = (value, regex, message) => {
    return (errors) => {
      if (!value.match(regex)) {
         errors.push(message);
      }
    };
  };

  module.exports = { login, signup };
}());