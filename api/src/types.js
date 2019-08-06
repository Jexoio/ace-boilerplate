// @flow
import type { $Response, $Request, NextFunction as $NextFunction } from 'express';
import type { ContainerInterface } from './ioc';

export type ACEHttp = {
  get: Function,
  put: Function,
  post: Function,
  del: Function,
  asUserByAccountId: (userAccountId: string) => Function,
}

export type ACE = {
  authenticate: () => (req: $Request, res: $Response, next: $NextFunction) => void,
  httpClient: () => ACEHttp,
  addon: { descriptor: { apiVersion: number } },
};

export interface SequelizeModel<T> {
  id: string;
  associate: Function;
  name: string;
  findOne(where: { where: Object }): Promise<?(SequelizeModel<T> & T)>;
  findByPk(id: string | number): Promise<?(SequelizeModel<T> & T)>;
  findOrCreate(object: T): Promise<SequelizeModel<T> & T>;
  findAll(where: { where: Object }): Promise<Array<?(SequelizeModel<T> & T)>>;
  create(model: Object): Promise<SequelizeModel<T> & T>;
  upsert(model: Object): Promise<boolean>;
  update(values: Object): Promise<SequelizeModel<T>> & T;
  destroy(object: Object, config: Object): Promise<any>;
  hasOne(model: SequelizeModel<any>, config: Object): void;
  hasMany(model: SequelizeModel<any>, config: Object): void;
  belongsTo(model: SequelizeModel<any>, config: Object): void;
  addScope(name: string, params: Object, config: Object): void;
  save(): Promise<SequelizeModel<T> & T>;
}

export type ACEContext = {
  title: string,
  addonKey: string,
  localBaseUrl: string,
  hostBaseUrl: string,
  hostStylesheetUrl: string,
  hostScriptUrl: string,
  token: string,
  license: string,
  context: string,
  clientKey: string,
  userAccountId: string,
  http: {
    addon: {
      descriptor: {
        apiVersion: number,
      };
    }
  }
};

type StringMap = { [key: string]: string };
export type ACERequest<T> = {
  ioc: ContainerInterface,
  context: ACEContext,
  query: StringMap,
  body?: T,
};

export type WSContext = {
  ioc: ContainerInterface,
  clientKey: string,
};

export type SubscriptionVariables = {
  clientKey: string,
};

export interface AddonServiceInterface {
  _http: ACEHttp;
  get(input: string | Object): Promise<any | Array<?any>>;
  put(input: string | Object): Promise<any>;
  post(input: string | Object): Promise<any>;
  delete(input: string | Object): Promise<any>;
  getUnpaginated(input: string | Object): Promise<any | Array<?any>>;
}

export type JiraApiResponse = {
  body: string,
  total: string,
};

export type JiraApiIssue = {
  id: string,
  self: string,
  key: string,
  fields: {
    summary: string,
  },
  expand?: string,
  renderedFields?: Object,
  properties?: Object,
  names?: Object,
  schema?: Object,
  transitions?: Array<{
    id: string,
    name: string,
    to: {
      self: string,
      description: string,
      iconUrl: string,
      name: string,
      id: string,
      statusCategory: Object,
    },
    hasScreen: true,
    isGlobal: true,
    isInitial: true,
    isConditional: true,
    fields: Object,
    expand: string,
  }>,
  operations?: {
    linkGroups: Array<{
      id: string,
      styleClass: string,
      header: Object,
      weight: number,
      links: Array<Object>,
      groups: Array<any>,
    }>,
  },
  editmeta?: {
    fields: Object,
  },
  changelog?: {
    startAt: number,
    maxResults: number,
    total: number,
    histories: [
      {
        id: string,
        author: Object,
        created: string,
        items: Array<Object>,
        historyMetadata: Object,
      },
    ],
  },
  versionedRepresentations?: Object,
  fieldsToInclude?: {
    included: [string],
    actuallyIncluded: [string],
    excluded: [string],
  },
};
