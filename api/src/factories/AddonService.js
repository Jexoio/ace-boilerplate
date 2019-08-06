// @flow
import { promisify } from 'util';
import { get } from 'lodash';
import { getBodyJson, getResultWithoutPagination } from '../utils/addonService';
import type { AddonServiceInterface, JiraApiResponse, ACEHttp } from '../types';

export type Interface = AddonServiceInterface;

/**
 * Wrapper around Jira's HTTP Client
 * https://developer.atlassian.com/cloud/jira/platform/rest/v2/
 *
 * @export
 * @class AddonService
 */
export default class AddonService implements AddonServiceInterface {
  _http: ACEHttp;

  _put: (...args: any) => Promise<any>;

  _post: (...args: any) => Promise<any>;

  _get: (...args: any) => Promise<any>;

  _del: (...args: any) => Promise<any>;

  async get(...args: any): Promise<JiraApiResponse> {
    return getBodyJson(this._get(...args));
  }

  async getUnpaginated(...args: any): Promise<any> {
    return getResultWithoutPagination(this._get, ...args);
  }

  async put(...args: any): Promise<JiraApiResponse> {
    return this._put(...args);
  }

  async post(...args: any): Promise<JiraApiResponse> {
    const response = await this._post(...args);

    const errorMessage = get(response, 'body.errors.name');
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    return response.body;
  }

  async delete(...args: any): Promise<JiraApiResponse> {
    return this._del(...args);
  }

  constructor(http: ACEHttp) {
    this._http = http;
    // promisify ace's get and post functions
    this._get = promisify(this._http.get).bind(this._http);
    this._put = promisify(this._http.put).bind(this._http);
    this._post = promisify(this._http.post).bind(this._http);
    this._del = promisify(this._http.del).bind(this._http);
  }

  asUserByAccountId(userAccountId: string): Function {
    return this._http.asUserByAccountId(userAccountId);
  }
}
