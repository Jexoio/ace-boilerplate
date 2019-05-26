// @flow
/* eslint-disable no-console,global-require,import/no-dynamic-require */
import { join } from 'path';
import { Container } from 'inversify';
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import {
  getDirectories, getFiles, adapter, model, domain, serviceFactory, service,
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
  getServiceFactory(name: string): Function;
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
function getServiceFactory(name) {
  return this.get(serviceFactory(name));
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

let container: ContainerInterface;
const getContainer = (): ContainerInterface => {
  if (!container) {
    container = new Container({ defaultScope: 'Singleton' });
    container.getAdapter = getAdapter.bind(container);
    container.getModel = getModel.bind(container);
    container.getDomain = getDomain.bind(container);
    container.getServiceFactory = getServiceFactory.bind(container);
    container.getService = getService.bind(container);
    container.rebindIfBound = rebindIfBound.bind(container);

    // get register instances https://github.com/inversify/inversify-vanillajs-helpers
    const registerConstantValue = helpers.registerConstantValue(container);
    const registerFactory = helpers.registerFactory(container);

    // load adapters
    const adapters = getDirectories(join(__dirname, '../adapters'));
    console.log('Loading adapters:', adapters);
    adapters.forEach(({ name, path }) => {
      // $FlowIgnore
      const adapterValue = require(path).default;
      registerConstantValue(adapter(name), adapterValue);
    });

    // load models
    const models = getFiles(join(__dirname, '../models'));
    const loadedModels: SequelizeModelMap<any> = {};
    console.log('Loading models:', models);
    models.forEach(({ name, path }) => {
      // $FlowIgnore
      const factoryFunction = require(path).default;
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
    const domains = getFiles(join(__dirname, '../domains'));
    console.log('Loading domains:', domains);
    domains.forEach(({ name, path }) => {
      // $FlowIgnore
      const Domain = require(path).default;
      const domainName = name.replace(/\.js/, '');
      container.bind(domain(domainName)).to(Domain);
    });
    // load services
    const services = getFiles(join(__dirname, '../services'));
    console.log('Loading services:', services);
    services.forEach(({ name, path }) => {
      if (name.includes('Factory')) {
        // $FlowIgnore
        const factoryFunction = require(path).default;
        const serviceName = name.replace(/\.js/, '');
        registerFactory(serviceName, factoryFunction);
      }
    });
  }
  return container;
};

export default getContainer;
