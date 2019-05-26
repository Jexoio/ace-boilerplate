// @flow
import type { $Response, $Request, NextFunction as $NextFunction } from 'express';
import type { ContainerInterface } from './ioc';

export type ACE = {
  authenticate: () => (req: $Request, res: $Response, next: $NextFunction) => void,
  httpClient: Function,
  addon: { descriptor: { apiVersion: number } },
  asUserByAccountId: (userAccountId: string) => Function,
  get: Function,
  put: Function,
  post: Function,
};

export interface SequelizeModel<T> {
  id: ?string;
  associate: ?Function;
  name: string;
  findOne(where: { where: Object }): Promise<?(SequelizeModel<T> & T)>;
  findById(id: string | number): Promise<?(SequelizeModel<T> & T)>;
  findOrCreate(object: T): Promise<SequelizeModel<T> & T>;
  findAll(where: { where: Object }): Promise<Array<?(SequelizeModel<T> & T)>>;
  create(model: T): Promise<SequelizeModel<T> & T>;
  update(values: Object): Promise<SequelizeModel<T>> & T;
  delete(object: SequelizeModel<T>, config: Object): Promise<any>;
  hasOne(model: SequelizeModel<any>, config: Object): void;
  hasMany(model: SequelizeModel<any>, config: Object): void;
  belongsTo(model: SequelizeModel<any>, config: Object): void;
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
};

type StringMap = { [key: string]: string };
export type ACERequest<T> = {
  ioc: ContainerInterface,
  context: ACEContext,
  ace: ACE,
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

export interface JiraServiceInterface {
  _ace: ACE;
  get(input: string | Object): Function;
  put(input: string | Object): Function;
  post(input: string | Object): Function;
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
