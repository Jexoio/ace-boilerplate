import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import {
  adapter, model, domain, service,
} from '../utils';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('ioc/utils', () => {
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  describe('adapter', () => {
    it('appends Adapter to source', () => {
      const result = adapter('test');
      expect(result).to.equals('testAdapter');
    });
  });

  describe('model', () => {
    it('appends Model to source', () => {
      const result = model('test');
      expect(result).to.equals('testModel');
    });
  });

  describe('domain', () => {
    it('appends Domain to source', () => {
      const result = domain('test');
      expect(result).to.equals('testDomain');
    });
  });

  describe('service', () => {
    it('appends Service to source', () => {
      const result = service('test');
      expect(result).to.equals('testService');
    });
  });
});
