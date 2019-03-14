const expect = require('chai').expect;
const sinon = require("sinon");
require('sinon-mongoose');

const User = require('../../api/user/user');
const authService = require('../../api/login/authService')

class ResponseMock {
    send(obj) {
        return this
    }
    status(value) {
        return this
    }
}

describe('Testing private _validate of auth.service', () => {
    it('Validate field cannot be undefined', () => {
        let value = undefined
        const errors = []
        const next = sinon.stub()
        authService._validate(value, 'Field cannot be undefined', errors, next)

        expect(errors).to.be.not.empty
        expect(errors).to.be.length(1)
        expect(errors).to.include('Field cannot be undefined')
        expect(next.called).to.be.false
    })
    it('Validate field cannot be null', () => {
        let value = null
        const errors = []
        const next = sinon.stub()
        authService._validate(value, 'Field cannot be null', errors, next)
        
        expect(errors).to.be.not.empty
        expect(errors).to.be.length(1)
        expect(errors).to.include('Field cannot be null')
        expect(next.called).to.be.false
    })
    it('Validate field cannot be empty', () => {
        let value = ''
        const errors = []
        const next = sinon.stub()
        authService._validate(value, 'Field cannot be empty', errors, next)
        
        expect(errors).to.be.not.empty
        expect(errors).to.be.length(1)
        expect(errors).to.include('Field cannot be empty')
        expect(next.called).to.be.false
    })
    it('Validate field different of empty', () => {
        let value = 'not empty anymore'
        const errors = []
        const next = sinon.stub()
        authService._validate(value, 'Field cannot be empty', errors, next)
        
        expect(errors).to.be.empty
        expect(next.called).to.be.true

        var errorsAsArgToNextFuction = next.getCall(0).args[0];
        expect(errorsAsArgToNextFuction).to.be.eq(errors)
    })
    it('Validate field different of empty and errors with some field', () => {
        let value = 'not empty anymore'
        const errors = ['Other fieald had a error']
        const next = sinon.stub()
        authService._validate(value, 'Field cannot be empty', errors, next)
        
        expect(errors).to.be.not.empty
        expect(errors).to.be.length(1)
        expect(next.called).to.be.true
        
        var errorsAsArgToNextFuction = next.getCall(0).args[0];
        expect(errorsAsArgToNextFuction).to.be.eq(errors)
    })
    it('Validate field different without next', () => {
        let value = 'not empty anymore'
        const errors = ['Other fieald had a error']
        authService._validate(value, 'Field cannot be empty', errors)
        
        expect(errors).to.be.not.empty
        expect(errors).to.be.length(1)
    })
})

describe.only('Testing private _validateFields of auth.service', () => {
    it('Should not be undefined the fields name, email and password', () => {
        const name = undefined
        const email = undefined
        const password = undefined
        
        const errors = {
            errors: [
              "O campo 'Nome' não pode ser vazio",
              "O campo 'E-mail' não pode ser vazio",
              "O campo 'Senha' não pode ser vazio"
            ]
          }
          
          try {
            authService._validateFields(name, email, password)
          } catch (err) {
              expect(err).to.deep.include(errors)
          }
    })
    it('Should the password have at less one character lowcase, uppercase, number, special character and of 8 to 12 caracteres', () => {
        const name = 'test'
        const email = 'test@test.com'
        const password = 'test'
        
        const errors = {
            errors: [
                "Senha precisa ter: uma letra maiúscula, uma letra minúscula, um número, um caracter especial e de 8 a 12 caracteres"
            ]
          }
          
          try {
            authService._validateFields(name, email, password)
          } catch (err) {
              expect(err).to.deep.include(errors)
          }
    })
    it('Should the email be a valid one', () => {
        const name = 'test'
        const email = 'test'
        const password = 'P@ssword1'
        
        const errors = {
            errors: [
                "O e-mail é inválido"
            ]
          }
          
          try {
            authService._validateFields(name, email, password)
          } catch (err) {
              expect(err).to.deep.include(errors)
          }
    })
    it('Should combine the erros from email must be a valid one and name cannot be empty', () => {
        const name = ''
        const email = 'test'
        const password = 'P@ssword1'
        
        const errors = {
            errors: [
                "O campo 'Nome' não pode ser vazio",
                "O e-mail é inválido"
            ]
          }
          
          try {
            authService._validateFields(name, email, password)
          } catch (err) {
              expect(err).to.deep.include(errors)
          }
    })
    it('Should combine the erros from password must be a valid one and name cannot be empty', () => {
        const name = ''
        const email = 'test@test.com'
        const password = 'test'
        
        const errors = {
            errors: [
                "O campo 'Nome' não pode ser vazio",
                "Senha precisa ter: uma letra maiúscula, uma letra minúscula, um número, um caracter especial e de 8 a 12 caracteres"
            ]
          }
          
          try {
            authService._validateFields(name, email, password)
          } catch (err) {
              expect(err).to.deep.include(errors)
          }
    })
})

describe('Testing signup', () => {
    it('Should check for already stored user', () => {
        const res = new ResponseMock()
        const statusSpy = sinon.spy(res, 'status')
        const sendSpy = sinon.spy(res, 'send')
        
        const userMock = sinon.mock(User)

        userMock.expects('findOne')
            .once()
            .withArgs({email: "email@test.com"})
            .chain('exec')
            .yields(null, {nome: "Test"})
        
        authService.signup(_getReqMockFullParameters(), res)
        
        expect(res.status.calledOnce).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        
        sinon.assert.calledWith(statusSpy, 412);
        sinon.assert.calledWith(sendSpy, { errors: ['Usuário já cadastrado'] });
        
        userMock.verify()
        userMock.restore()
    });
});

const _getReqMockFullParameters = () => ({ "body": { nome: "test", email: "email@test.com", senha: "P@ssword1"}})