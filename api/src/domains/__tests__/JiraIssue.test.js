import { createSandbox } from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import JiraIssueDomain from '../JiraIssue';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('JiraIssue Domain', () => {
  const addonServiceMock = {
    get: sandbox.stub().resolves(JSON.stringify({ issues: [{ id: 1 }] })),
    put: sandbox.stub().resolves(true),
  };
  const underTest = new JiraIssueDomain(addonServiceMock);
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });
  describe('getIssues', () => {
    it('delegates to jira service', async () => {
      await underTest.getIssues(1, 10);
      expect(addonServiceMock.get).to.have.been.calledOnce;
      expect(addonServiceMock.get.getCalls()[0].args[0])
        .to.match(/startAt=1/)
        .and.match(/maxResults=10/);
    });
  });
  describe('udpateSummary', () => {
    it('delegates to jira service', async () => {
      await underTest.updateSummary('id-1', 'new summary');
      expect(addonServiceMock.put).to.have.been.calledOnce;
      expect(addonServiceMock.put.getCalls()[0].args[0]).to.deep.include({
        body: { fields: { summary: 'new summary' } },
      });
    });
  });
});
