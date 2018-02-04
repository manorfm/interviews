(function () {
    'use strict';

    process.env.NODE_ENV = 'test';

    const mongoose = require("mongoose");

    //Require the dev-dependencies
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    const server = require('../loader');
    const should = chai.should();
    const assert = chai.assert;

    chai.use(chaiHttp);

    let token;
    let objectID;

    describe('Testar a criação e login do usuário', function () {
        it('Criar usuário Manoel', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "email": "manoel.rodrigo@gmail.com", "senha": "Teste@1", "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(201);
                    should.exist(res.body);
                    res.body.nome.should.equals("Manoel Medeiros");
                    res.body.email.should.equals("manoel.rodrigo@gmail.com");
                    should.exist(res.body.token);
                    token = res.body.token;
                    done();
                });
        });
        it('Logar com o usuário Manoel', function (done) {
            chai.request(server)
                .post('/open/login')
                .send({ "email": "manoel.rodrigo@gmail.com", "senha": "Teste@1" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.nome.should.equals("Manoel Medeiros");
                    res.body.email.should.equals("manoel.rodrigo@gmail.com");
                    should.exist(res.body.token);
                    
                    token = res.body.token;
                    objectID = res.body._id;

                    done();
                });
        });
        it('Recuperar a lista de usuários, com apenas 1 elemento', function (done) {
            chai.request(server)
                .get('/api/user')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(200);
                    should.exist(res.body);
                    assert.equal(res.body.length, 1);
                    let user = res.body[0];
                    assert.equal(user.nome, "Manoel Medeiros");
                    assert.equal(user.email, "manoel.rodrigo@gmail.com");
                    assert.isArray(user.telefones);
                    done();
                });
        });
    });

    describe('Testar as mensagens de validações', function () {
        it('Validar usuário existente.', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "email": "manoel.rodrigo@gmail.com", "senha": "Teste@1", "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal('Usuário já cadastrado', errors[0]);
                    done();
                });
        });
        it('Validar email', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "email": "manoel.rodrigo", "senha": "Teste@1", "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal('O e-mail é inválido', errors[0]);
                    done();
                });
        });
        it('Validar email', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "email": "manoel.rodrigo@gmail", "senha": "Teste@1", "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal('O e-mail é inválido', errors[0]);
                    done();
                });
        });
        it('Validar senha sem letra maiúscula', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "email": "manoel.rodrigo@gmail.com", "senha": "teste@1", "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal('Senha precisa ter: uma letra maiúscula, uma letra minúscula, um número, um caracter especial e de 8 a 12 caracteres', errors[0]);
                    done();
                });
        });
        it('Validar senha sem caracter especial', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "email": "manoel.rodrigo@gmail.com", "senha": "Testea1", "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal('Senha precisa ter: uma letra maiúscula, uma letra minúscula, um número, um caracter especial e de 8 a 12 caracteres', errors[0]);
                    done();
                });
        });
        it('Validar senha sem número', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "email": "manoel.rodrigo@gmail.com", "senha": "Teste@a", "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal('Senha precisa ter: uma letra maiúscula, uma letra minúscula, um número, um caracter especial e de 8 a 12 caracteres', errors[0]);
                    done();
                });
        });
        it('Validar sem parâmetros', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal(errors.length, 3)
                    assert.equal("O campo 'Nome' não pode ser vazio", errors[0]);
                    assert.equal("O campo 'E-mail' não pode ser vazio", errors[1]);
                    assert.equal("O campo 'Senha' não pode ser vazio", errors[2]);
                    done();
                });
        });
        it('Validar com um parâmetros', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "nome": "Manoel Medeiros" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal(errors.length, 2)
                    assert.equal("O campo 'E-mail' não pode ser vazio", errors[0]);
                    assert.equal("O campo 'Senha' não pode ser vazio", errors[1]);
                    done();
                });
        });
        it('Validar com dois parâmetros', function (done) {
            chai.request(server)
                .post('/open/signup')
                .send({ "nome": "Manoel Medeiros", "email": "manoel.rodrigo@gmail.com" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(412);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal(errors.length, 1)
                    assert.equal("O campo 'Senha' não pode ser vazio", errors[0]);
                    done();
                });
        });
        it('Validar usuário inválido', function (done) {
            chai.request(server)
                .post('/open/login')
                .send({ "email": "opa@gmail.com", "senha": "Teste@1" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(401);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal(errors.length, 1)
                    assert.equal("Usuário e/ou senha inválidos", errors[0]);
                    done();
                });
        });
        it('Validar senha inválida', function (done) {
            chai.request(server)
                .post('/open/login')
                .send({ "email": "manoel.rodrigo@gmail.com", "senha": "Testee@1" })
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(401);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal(errors.length, 1)
                    assert.equal("Usuário e/ou senha inválidos", errors[0]);
                    done();
                });
        });
        it('Validar acesso não autorizado', function (done) {
            chai.request(server)
                .get('/api/user')
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(403);
                    should.exist(res.body);
                    let errors = res.body.errors;
                    assert.isArray(errors)
                    assert.equal(errors.length, 1)
                    assert.equal("Não autorizado.", errors[0]);
                    done();
                });
        });
        it('Validar usuário inexistente', function (done) {
            chai.request(server)
                .get(`/api/user/5ac50e4189dfba1f58ad6902`)
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('Testar update no usuário cadastrado', function () {
        it('Atualizar nome de Manoel', function (done) {
            chai.request(server)
                .put(`/api/user/${objectID}`)
                .send({ "nome": "Manoel Rodrigo Farinha de Medeiros" })
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.nome.should.not.equals("Manoel Medeiros");
                    res.body.nome.should.equals("Manoel Rodrigo Farinha de Medeiros");
                    res.body.email.should.equals("manoel.rodrigo@gmail.com");
                    done();
                });
        });

        it('Adicionando telefones', function (done) {
            chai.request(server)
                .put(`/api/user/${objectID}`)
                .send({ "telefones": [{"ddd": 81, "numero": 992684093}]})
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(200);
                    should.exist(res.body);

                    let user = res.body;
                    assert.isArray(user.telefones)
                    assert.equal(user.telefones.length, 1);
                    assert.equal(user.telefones[0].ddd, 81);
                    assert.equal(user.telefones[0].numero, 992684093);

                    done();
                });
        });
        it('Verificando atualização de telefones', function (done) {
            chai.request(server)
                .get(`/api/user/${objectID}`)
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(200);
                    should.exist(res.body);

                    let user = res.body;
                    assert.isArray(user.telefones)
                    assert.equal(user.telefones.length, 1);
                    assert.equal(user.telefones[0].ddd, 81);
                    assert.equal(user.telefones[0].numero, 992684093);

                    done();
                });
        });
    });


    describe('Testar remoção do usuário', function () {
        it('removendo o usuário Manoel', function (done) {
            chai.request(server)
                .del(`/api/user/${objectID}`)
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    res.should.have.status(204);
                    done();
                });
        });
        it('Verificando a inexistência do usuário', function (done) {
            chai.request(server)
                .get(`/api/user/${objectID}`)
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    res.should.be.json;
                    res.should.have.status(404);
                    done();
                });
        });
    });

    after(function (done) {
        console.log('deletando banco de dados de teste.');
        mongoose.connection.db.dropDatabase(done);
        done();
    });
}());