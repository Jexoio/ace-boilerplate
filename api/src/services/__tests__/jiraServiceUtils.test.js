import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { getBodyJson, getResultWithoutPagination } from '../utils/jiraServiceUtils';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const sandbox = createSandbox();

describe('services/utils/jiraServiceUtils', () => {
  let resolverFn;
  beforeEach(() => {
    resolverFn = sandbox.stub().resolves({
      body: JSON.stringify({ total: 1, entries: [{ foo: 'bar' }] }),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getBodyJson', () => {
    it('returns parsed body string property of an object', async () => {
      const promise = Promise.resolve({ body: JSON.stringify({ prop: 'val', entries: [{ foo: 'bar' }] }) });
      const res = await getBodyJson(promise);
      expect(res).to.deep.equal({ prop: 'val', entries: [{ foo: 'bar' }] });
    });

    it('throws when the promise lacks a body entry', async () => {
      const promise = Promise.resolve({ nobody: null });
      expect(getBodyJson(promise)).to.be.rejected;
    });
  });

  describe('getResultWithoutPagination', () => {
    it('does not paginate when total is < maxResults', async () => {
      await getResultWithoutPagination(resolverFn, '/foo', 'entries', 0, 3);
      expect(resolverFn).to.have.been.calledOnce;
    });

    it('does not paginate when total is == maxResults', async () => {
      await getResultWithoutPagination(resolverFn, '/foo', 'entries', 0, 1);
      expect(resolverFn).to.have.been.calledOnce;
    });

    it('paginates when total is > maxResults', async () => {
      resolverFn = sandbox.stub().resolves({
        body: JSON.stringify({ total: 2, entries: [{ foo: 'bar' }] }),
      });
      await getResultWithoutPagination(resolverFn, '/foo', 'entries', 0, 1);
      expect(resolverFn).to.have.been.calledTwice;
    });
  });
});
