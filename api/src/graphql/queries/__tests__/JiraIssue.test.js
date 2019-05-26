import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import { issues, summary } from '../JiraIssue';
import JiraIssueDomain from '../../../domains/JiraIssue';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('JiraIssueQuery', () => {
  const mockedJiraIssueDomain = sandbox.createStubInstance(JiraIssueDomain);
  mockedJiraIssueDomain.getIssues = sandbox.stub();

  const req = {
    ioc: {
      getDomain: sandbox
        .stub()
        .withArgs('JiraIssue')
        .returns(mockedJiraIssueDomain),
    },
  };

  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  describe('getIssues', () => {
    it('resolves issues from domain', async () => {
      await issues(null, null, req, null);
      expect(mockedJiraIssueDomain.getIssues).to.be.calledOnce;
    });
  });

  describe('summary', () => {
    it('resolves name from fields object', async () => {
      const value = await summary({ fields: { summary: 'foo' } }, null, req, null);
      expect(value).to.equals('foo');
    });
  });
});
