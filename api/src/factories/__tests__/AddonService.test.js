import { createSandbox } from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import AddonService from '../AddonService';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('AddonService', () => {
  const response = { body: JSON.stringify({ foo: 'bar' }) };
  const httpMock = {
    get: (args, cb) => cb(null, response),
    put: (args, cb) => cb(null, response),
    post: (args, cb) => cb(null, response),
    del: (args, cb) => cb(null, response),
  };
  const underTest = new AddonService(httpMock);
  beforeEach(() => { });

  afterEach(() => {
    sandbox.restore();
  });

  describe('http methods', () => {
    it('parses response body', async () => {
      const getResponse = await underTest.get('/nowhere');
      const putResponse = await underTest.get('/nowhere');
      const postResponse = await underTest.get('/nowhere');
      const delResponse = await underTest.get('/nowhere');
      expect(getResponse).to.be.eql({ foo: 'bar' });
      expect(putResponse).to.be.eql({ foo: 'bar' });
      expect(postResponse).to.be.eql({ foo: 'bar' });
      expect(delResponse).to.be.eql({ foo: 'bar' });
    });
  });
});
