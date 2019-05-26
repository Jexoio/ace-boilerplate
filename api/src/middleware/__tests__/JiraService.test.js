import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import middleware from '../jiraService';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('JiraService Middleware', () => {
  let getServiceFactoryStub;
  let toConstantValueStub;
  let nextStub;

  const req = {
    ioc: {
      getServiceFactory: () => getServiceFactoryStub,
      rebindIfBound: () => ({ toConstantValue: toConstantValueStub }),
    },
    context: {
      clientKey: null,
    },
  };

  beforeEach(() => {
    getServiceFactoryStub = sandbox.stub().returns();
    toConstantValueStub = sandbox.stub();
    nextStub = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('default', () => {
    it('creates a new object from factory when req.context.clientKey is present', () => {
      req.context.clientKey = 'foo-bar';
      middleware(req, null, nextStub);
      expect(getServiceFactoryStub).to.have.been.calledOnce;
      expect(toConstantValueStub).to.have.been.calledOnce;
    });

    it('does not create a new object from factory when req.context.clientKey is absent', () => {
      req.context.clientKey = null;
      middleware(req, null, nextStub);
      expect(getServiceFactoryStub).not.to.have.been.called;
    });
  });
});
