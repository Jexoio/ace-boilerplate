import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { decode } from 'atlassian-jwt';
import request from 'request-promise';
import AddonSettings from '../../domains/AddonSettings';
import JiraClient from '../JiraClient';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const sandbox = createSandbox();

describe('services/JiraClient', () => {
  let AddonSettingsStub;
  let underTest;

  beforeEach(() => {
    AddonSettingsStub = sandbox.createStubInstance(AddonSettings);
    underTest = new JiraClient(AddonSettingsStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getToken', () => {
    it('creates a token 3 min token', () => {
      const token = underTest.getToken('get', '/foo', 'issuer', 'shared-secret');
      const { iat, exp } = decode(token, 'shared-secret');
      expect(exp).to.equals(iat + 180);
    });
  });

  describe('_request', () => {
    it('uses given method and JWT', async () => {
      const getStub = sandbox.stub(request, 'get').resolves(true);
      AddonSettingsStub.getAddonSettings.resolves({
        val: { key: 'issuer', sharedSecret: 'shared-secret', baseUrl: 'https://my-addon' },
      });

      const token = underTest.getToken('get', '/foo', 'issuer', 'shared-secret');
      await underTest._request('get', '/foo', 'key-1', { var: 'val' });
      expect(getStub).to.have.been.calledWithMatch({
        url: 'https://my-addon/foo',
        json: { var: 'val' },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      }).and.to.have.been.calledOnce.and;
    });
  });

  describe('get', () => {
    it('delegates to request.get', async () => {
      const getStub = sandbox.stub(request, 'get').resolves(true);
      AddonSettingsStub.getAddonSettings.resolves({
        val: { key: 'issuer', sharedSecret: 'shared-secret', baseUrl: 'https://my-addon' },
      });
      await underTest.get('/foo', 'client-key-1');
      expect(getStub).to.have.been.calledOnce;
    });
  });

  describe('post', () => {
    it('delegates to request.post', async () => {
      const postStub = sandbox.stub(request, 'post').resolves(true);
      AddonSettingsStub.getAddonSettings.resolves({
        val: { key: 'issuer', sharedSecret: 'shared-secret', baseUrl: 'https://my-addon' },
      });
      await underTest.post('/foo', 'client-key-1');
      expect(postStub).to.have.been.calledOnce;
    });
  });

  describe('put', () => {
    it('delegates to request.put', async () => {
      const putStub = sandbox.stub(request, 'put').resolves(true);
      AddonSettingsStub.getAddonSettings.resolves({
        val: { key: 'issuer', sharedSecret: 'shared-secret', baseUrl: 'https://my-addon' },
      });
      await underTest.put('/foo', 'client-key-1');
      expect(putStub).to.have.been.calledOnce;
    });
  });

  describe('delete', () => {
    it('delegates to request.delete', async () => {
      const deleteStub = sandbox.stub(request, 'delete').resolves(true);
      AddonSettingsStub.getAddonSettings.resolves({
        val: { key: 'issuer', sharedSecret: 'shared-secret', baseUrl: 'https://my-addon' },
      });
      await underTest.delete('/foo', 'client-key-1');
      expect(deleteStub).to.have.been.calledOnce;
    });
  });
});
