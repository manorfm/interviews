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

describe('should test signup', () => {
    it('should check for already stored user', () => {
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