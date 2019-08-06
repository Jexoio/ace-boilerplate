// @flow
/* eslint-disable global-require,import/no-dynamic-require */
import { join } from 'path';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import {
  getDirectories, getFiles, adapter, model, domain, service,
} from './utils';

import type { SequelizeModel } from '../types';

export interface ContainerInterface {
  bind(name: string): Function;
  rebindIfBound(name: string): Function;
  get(name: string): Function;
  getAdapter(name: string): Function;
  getModel(name: string): Function;
  getDomain(name: string): Function;
  getService(name: string): Function;
}

type SequelizeModelMap<T> = { [key: string]: SequelizeModel<T> };

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

export default (): ContainerInterface => {
  const container = new Container({ defaultScope: 'Singleton' });
  container.getAdapter = getAdapter.bind(container);
  container.getModel = getModel.bind(container);
  container.getDomain = getDomain.bind(container);
  container.getService = getService.bind(container);
  container.rebindIfBound = rebindIfBound.bind(container);

  // get register instances https://github.com/inversify/inversify-vanillajs-helpers
  const registerConstantValue = helpers.registerConstantValue(container);
  const registerFactory = helpers.registerFactory(container);

  // load adapters
  adapters.forEach(({ name, path }) => {
    // $FlowIgnore
    const adapterValue = require(path).default;
    registerConstantValue(adapter(name), adapterValue);
  });

  // load models
  const loadedModels: SequelizeModelMap<any> = {};
  models.forEach(({ name, path }) => {
    // $FlowIgnore
    const factoryFunction = require(path).default;
    const modelName = name.replace(/\.js/, '');
    registerFactory(model(modelName), factoryFunction);
    // cache loaded models to pass to associate fn later
    loadedModels[modelName] = container.getModel(modelName);
  });

  // load model associations
  Object.values(loadedModels).forEach((loadedModel) => {
    // $FlowFixMe https://github.com/facebook/flow/issues/2221
    if (typeof loadedModel.associate === 'function') {
      loadedModel.associate(loadedModels);
    }
  });

  // load domains
  domains.forEach(({ name, path }) => {
    // $FlowIgnore
    const Domain = require(path).default;
    const domainName = name.replace(/\.js/, '');
    container.bind(domain(domainName)).to(Domain);
  });

  // load services
  services.forEach(({ name, path }) => {
    // $FlowIgnore
    const Service = require(path).default;
    const serviceName = name.replace(/\.js/, '');
    container.bind(service(serviceName)).to(Service);
  });
  return container;
};
