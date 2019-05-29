import { createSandbox } from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import JiraIssueDomain from '../JiraIssue';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('JiraIssue Domain', () => {
  const jiraServiceMock = {
    get: sandbox.stub().resolves(JSON.stringify({ issues: [{ id: 1 }] })),
    put: sandbox.stub().resolves(true),
  };
  const underTest = new JiraIssueDomain(jiraServiceMock);
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });
  describe('getIssues', () => {
    it('delegates to jira service', async () => {
      await underTest.getIssues(1, 10);
      expect(jiraServiceMock.get).to.have.been.calledOnce;
      expect(jiraServiceMock.get.getCalls()[0].args[0])
        .to.match(/startAt=1/)
        .and.match(/maxResults=10/);
    });
  });
  describe('udpateSummary', () => {
    it('delegates to jira service', async () => {
      await underTest.updateSummary('id-1', 'new summary');
      expect(jiraServiceMock.put).to.have.been.calledOnce;
      expect(jiraServiceMock.put.getCalls()[0].args[0]).to.deep.include({
        body: { fields: { summary: 'new summary' } },
      });
    });
  });
});
