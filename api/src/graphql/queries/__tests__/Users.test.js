import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import { me } from '../User';
import UserDomain from '../../../domains/User';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('UserQuery', () => {
  const mockedUserDomain = sandbox.createStubInstance(UserDomain);
  mockedUserDomain.findOne = where => where;

  const req = {
    ioc: {
      getDomain: sandbox
        .stub()
        .withArgs('User')
        .returns(mockedUserDomain),
    },
    context: { userAccountId: 'test-user-account-id' },
  };

  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  describe('me', () => {
    it('resolves user based on userAccountId defined in request', async () => {
      const userMe = await me(null, null, req, null);
      expect(userMe.userAccountId).to.equals('test-user-account-id');
    });
  });
});
