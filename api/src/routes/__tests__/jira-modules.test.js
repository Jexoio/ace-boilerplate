import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import addRoutes from '../index';
import { getQueryString } from '../jira-modules';
import UserDomain from '../../domains/User';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('routes/jira-modules', () => {
  let app;
  let UserDomainStub;

  beforeEach(() => {
    app = express();
    UserDomainStub = sandbox.createStubInstance(UserDomain);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      req.context = {
        userAccountId: 'user-account-id-1',
        clientKey: 'client-key-1',
      };
      req.ace = { addon: { descriptor: { apiVersion: 1 } } };
      req.ioc = {
        getDomain: sandbox
          .stub()
          .withArgs('User')
          .returns(UserDomainStub),
      };
      next();
    });
    addRoutes(app, { authenticate: () => (req, res, next) => next() });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getQueryString', () => {
    it('turns a string:string map into a key=value string', () => {
      const result = getQueryString({ query: { foo: 'bar', boo: 'baz' }, context: {} });
      expect(result).to.equal('&foo=bar&boo=baz');
    });

    it('replaces query string token with context token', () => {
      const result = getQueryString({
        query: { foo: 'bar', boo: 'baz', token: 'query-token' },
        context: { token: 'context-token' },
      });
      expect(result).to.equal('&foo=bar&boo=baz&token=query-token');
    });
  });

  describe('/', () => {
    it('returns atlas-connect.json', () => request(app)
      .get('/')
      .expect(200)
      .expect(({ text }) => {
        expect(text).to.match(/"key":"my-super-awesome-add-on","name":"My Super Awesome Add On"/);
      }));
  });

  describe('/hello-world', () => {
    it('fetches user based on context.userAccountId', () => {
      UserDomainStub.findOne = sandbox.stub().resolves({ id: 'user-id-1', name: 'user-name' });
      return request(app)
        .get('/hello-world')
        .expect(302)
        .expect(() => {
          expect(UserDomainStub.findOne).to.have.been.calledOnce;
          expect(UserDomainStub.findOne).to.have.been.calledWithMatch({ userAccountId: 'user-account-id-1' });
        });
    });
    it('creates user if user does not exist', () => {
      UserDomainStub.findOne = sandbox.stub().resolves(null);
      return request(app)
        .get('/hello-world')
        .expect(302)
        .expect(() => {
          expect(UserDomainStub.findOne).to.have.been.calledOnce;
          expect(UserDomainStub.findOne).to.have.been.calledWithMatch({ userAccountId: 'user-account-id-1' });
          expect(UserDomainStub.create).to.have.been.calledWithMatch({ userAccountId: 'user-account-id-1' });
        });
    });
  });

  describe('/expired', () => {
    it('redirects', () => request(app)
      .get('/expired')
      .expect(302));
  });
});
