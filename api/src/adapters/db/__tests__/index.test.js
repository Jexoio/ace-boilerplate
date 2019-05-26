/* eslint-disable global-require */
import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import Sequelize from 'sequelize';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('DB Adapter', () => {
  let useCLSStub;
  let environment;

  beforeEach(() => {
    environment = process.env;
    process.env.DATABASE_URL = 'postgres://postgres@localhost/postgres';
    process.env.DB_DIALECT = 'postgres';
    process.env.DB_POOL_MAX = 5;
    useCLSStub = sandbox.stub(Sequelize, 'useCLS');
  });

  afterEach(() => {
    sandbox.restore();
    process.env = environment;
  });

  describe('sequelize', () => {
    it('uses CLS', () => {
      require('../');
      expect(useCLSStub).to.have.been.calledOnce;
    });
  });

  describe('beforeCreate', () => {
    it('does not auto generate uuid id for AddonSettings model', () => {
      const instance = {
        id: 'instance-id',
        constructor: { name: 'AddonSettings' },
      };
      const { beforeCreate } = require('../');
      const fields = ['foo', 'bar'];
      beforeCreate(instance, { fields });

      expect(instance.id).to.be.equals('instance-id');
    });

    it('does not auto generate uuid id models without id field', () => {
      const instance = {
        id: 'instance-id',
        constructor: { name: 'AddonSettings' },
      };
      const { beforeCreate } = require('../');
      const fields = ['foo', 'bar'];
      beforeCreate(instance, { fields });

      expect(instance.id).to.be.equals('instance-id');
    });

    it('auto generates uuid id for models with id field', () => {
      const instance = {
        id: 'instance-id',
        constructor: { name: 'TestModel' },
      };
      const { beforeCreate } = require('../');
      const fields = ['id', 'foo', 'bar'];
      beforeCreate(instance, { fields });

      expect(instance.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });
});
