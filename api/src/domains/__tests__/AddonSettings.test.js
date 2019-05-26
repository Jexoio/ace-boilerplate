import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import AddonSettingsDomain from '../AddonSettings';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('AddonSettings Domain', () => {
  const AddonSettingsMock = {
    findOne: null,
  };
  const underTest = new AddonSettingsDomain(AddonSettingsMock);
  beforeEach(() => {
    AddonSettingsMock.findOne = sandbox.stub().resolves({ id: 1, val: { sharedSecret: 'foo' } });
  });

  afterEach(() => {
    sandbox.restore();
  });
  describe('getAddonSettings', () => {
    it('delegates to model', async () => {
      await underTest.getAddonSettings();
      expect(AddonSettingsMock.findOne).to.have.been.calledOnce;
    });
  });
  describe('getSharedSecret', () => {
    it('gets Addon Settings', async () => {
      await underTest.getSharedSecret();
      expect(AddonSettingsMock.findOne).to.have.been.calledOnce;
    });
    it('returns an empty string if no AddonSettings if found', async () => {
      AddonSettingsMock.findOne.resolves(null);
      const secret = await underTest.getSharedSecret();
      expect(secret).to.be.empty;
    });
  });
});
