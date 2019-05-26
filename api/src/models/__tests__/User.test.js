import SequelizeMock from 'sequelize-mock';
import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import userFactory from '../User';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('UserModel', () => {
  const contextMock = {
    container: {
      getAdapter: sandbox.stub().returns(new SequelizeMock()),
    },
  };
  const underTest = userFactory(contextMock);
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  it('has a primary key', () => {
    expect(underTest.options.hasPrimaryKeys).to.be.true;
  });
});
