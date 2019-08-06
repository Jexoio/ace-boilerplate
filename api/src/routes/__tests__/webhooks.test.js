import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import addRoutes from '../index';
import AddonSettings from '../../domains/AddonSettings';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('routes/webhooks', () => {
  let app;
  let pubsubStub;

  beforeEach(() => {
    pubsubStub = sandbox.createStubInstance(RedisPubSub);
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      req.context = {
        userAccountId: 'user-account-id',
        clientKey: 'client-key',
        http: {
          addon: {
            descriptor: {
              apiVersion: '1.0.0',
            },
          },
        },
      };
      req.ace = { addon: { descriptor: { apiVersion: 1 } } };
      req.ioc = {
        getDomain: sandbox
          .stub()
          .withArgs('AddonSettings')
          .returns(sandbox.createStubInstance(AddonSettings)),
        getAdapter: sandbox
          .stub()
          .withArgs('pubsub')
          .returns(pubsubStub),
      };
      next();
    });
    addRoutes(app, { authenticate: () => (req, res, next) => next() });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('enabled', () => {
    it('responds', () => request(app)
      .post('/enabled')
      .expect(200)
      .expect(({ text }) => {
        expect(text).to.equals('Addon Enabled!');
      }));
  });

  describe('disabled', () => {
    it('responds', () => request(app)
      .post('/disabled')
      .expect(200)
      .expect(({ text }) => {
        expect(text).to.equals('Addon Disabled!');
      }));
  });

});
