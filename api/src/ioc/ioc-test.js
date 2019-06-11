// @flow
/* eslint-disable no-console,global-require,import/no-dynamic-require */
import { join } from 'path';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import { createSandbox } from 'sinon'; // eslint-disable-line
import {
  getDirectories, getFiles, adapter, model, domain, service,
} from './utils';
import type { SequelizeModel } from '../types';
import type { ContainerInterface } from './index';

type SequelizeModelMap = { [key: string]: SequelizeModel<any> };

function getAdapter(name) {
  return this.get(adapter(name));
}

function getModel(name) {
  return this.get(model(name));
}

function getDomain(name) {
  return this.get(domain(name));
}

function getService(name) {
  return this.get(service(name));
}

function rebindIfBound(name) {
  try {
    return this.rebind(name);
  } catch (e) {
    return this.bind(name);
  }
}

const adapters = getDirectories(join(__dirname, '../adapters'));
const models = getFiles(join(__dirname, '../models'));
const domains = getFiles(join(__dirname, '../domains'));
const services = getFiles(join(__dirname, '../services'));

let container: ContainerInterface;
const sandbox = createSandbox();
const getTestContainer = (): ContainerInterface => {
  container = new Container({ defaultScope: 'Singleton' });
  container.getAdapter = getAdapter.bind(container);
  container.getModel = getModel.bind(container);
  container.getDomain = getDomain.bind(container);
  container.getService = getService.bind(container);
  container.rebindIfBound = rebindIfBound.bind(container);

  // get register instances https://github.com/inversify/inversify-vanillajs-helpers
  const registerConstantValue = helpers.registerConstantValue(container);
  const registerFactory = helpers.registerFactory(container);

  // load adapters
  console.log('Loading adapters:', adapters);
  adapters.forEach(({ name }) => {
    const adapterValue = sandbox.stub();
    registerConstantValue(adapter(name), adapterValue);
  });

  // load models
  const loadedModels: SequelizeModelMap = {};
  console.log('Loading models:', models);
  models.forEach(({ name }) => {
    const factoryFunction = sandbox.stub();
    const modelName = name.replace(/\.js/, '');
    registerFactory(model(modelName), factoryFunction);
    // cache loaded models to pass to associate fn later
    loadedModels[modelName] = container.getModel(modelName);
  });
  Object.values(loadedModels).forEach((loadedModel) => {
    // $FlowFixMe https://github.com/facebook/flow/issues/2221
    if (typeof loadedModel.associate === 'function') {
      // $FlowFixMe
      console.log('Loading associations for:', loadedModel.name);
      // $FlowFixMe
      loadedModel.associate(loadedModels);
    }
  });

  // load domains
  console.log('Loading domains:', domains);
  domains.forEach(({ name }) => {
    const Domain = sandbox.stub();
    const domainName = name.replace(/\.js/, '');
    container.bind(domain(domainName)).to(Domain);
  });

  // load services
  console.log('Loading services:', services);
  services.forEach(({ name }) => {
    const Service = sandbox.stub();
    const serviceName = name.replace(/\.js/, '');
    container.bind(service(serviceName)).to(Service);
  });
  return container;
};

export default getTestContainer;
