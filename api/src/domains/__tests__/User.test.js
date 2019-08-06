import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import UserDomain from '../User';

chai.use(sinonChai);
const sandbox = createSandbox();

describe('User Domain', () => {
  const userModelMock = {
    findAll: sandbox.stub().resolves([{ id: 1 }]),
    findByPk: sandbox.stub().resolves({ id: 1 }),
    create: sandbox.stub().resolves({ id: 1 }),
    findOne: sandbox.stub().resolves({ id: 1 }),
  };
  const underTest = new UserDomain(userModelMock);
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    it('delegates to model', async () => {
      await underTest.findAll();
      expect(userModelMock.findAll).to.have.been.calledOnce;
    });
  });

  describe('findByPk', () => {
    it('delegates to model', async () => {
      await underTest.findByPk();
      expect(userModelMock.findByPk).to.have.been.calledOnce;
    });
  });

  describe('create', () => {
    it('delegates to model', async () => {
      await underTest.create();
      expect(userModelMock.create).to.have.been.calledOnce;
    });
  });

  describe('findOne', () => {
    it('delegates to model', async () => {
      await underTest.findOne();
      expect(userModelMock.findOne).to.have.been.calledOnce;
    });
  });

  describe('update', () => {
    it('calls model save method', async () => {
      const model = { save: sandbox.stub().resolves() };
      await underTest.update(model);
      expect(model.save).to.have.been.calledOnce;
    });
  });
});
