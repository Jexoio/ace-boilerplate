import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import middleware from '../addon';
import * as factory from '../../factories/AddonServiceFactory';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('AddonService Middleware', () => {
  let toDynamicValueStub;
  let nextStub;
  let addonStub;

  const req = {
    ioc: {
      rebindIfBound: () => ({ toDynamicValue: toDynamicValueStub }),
    },
    context: {
      clientKey: null,
    },
  };

  beforeEach(() => {
    addonStub = { httpClient: sandbox.stub().returns({}) };
    toDynamicValueStub = sandbox.stub();
    nextStub = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('default', () => {
    it('creates a new object from factory when req.context.clientKey is present', () => {
      req.context.clientKey = 'foo-bar';
      middleware(addonStub)(req, null, nextStub);
      expect(toDynamicValueStub).to.have.been.calledOnce;
    });

    it('does not create a new object from factory when req.context.clientKey is absent', () => {
      req.context.clientKey = null;
      middleware(req, null, nextStub);
      expect(toDynamicValueStub).not.to.have.been.calledOnce;
    });
  });
});
