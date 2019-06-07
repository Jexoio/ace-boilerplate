import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import middleware from '../ioc';
import * as ioc from '../../ioc';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('IoC Middleware', () => {
  let toConstantValueStub;
  let nextStub;
  let createContainerStub;

  const req = {
    ioc: {
      rebindIfBound: () => ({ toConstantValue: toConstantValueStub }),
    },
    context: {
      clientKey: null,
    },
  };

  beforeEach(() => {
    createContainerStub = sandbox.stub(ioc, 'default').returns({});
    toConstantValueStub = sandbox.stub();
    nextStub = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('default', () => {
    it('creates a new ioc container for every request', () => {
      middleware(req, null, nextStub);
      expect(createContainerStub).to.have.been.calledOnce;
      middleware(req, null, nextStub);
      expect(createContainerStub).to.have.been.calledTwice;
    });
  });
});
