// @flow
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import request from 'request-promise-native';
import {
  encode, createQueryStringHash, Request, fromMethodAndUrl,
} from 'atlassian-jwt';
import type { Interface as AddonSettings } from '../domains/AddonSettings';
import { domain } from '../ioc/utils';

/**
 * Jira api client wrapper to be used outside an instance's http request lifecyle.
 * Use this class' http method wrappers to interact with Jira's api providing a clientKey
 * and JiraClient will look up the right information from AddonSettings and sign the request.
 *
 * @class JiraClient
 */
class JiraClient {
  addonSettings: AddonSettings;

  constructor(addonSettings: AddonSettings) {
    this.addonSettings = addonSettings;
  }

  getToken = (method: string = 'get', path: string, iss: string, sharedSecret: string): Promise<string> => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 180;
    const req: Request = fromMethodAndUrl(method, path);
    const tokenData = {
      iss,
      iat,
      exp,
      qsh: createQueryStringHash(req),
    };

    const token = encode(tokenData, sharedSecret);
    return token;
  };

  async _request(method: string, path: string, clientKey: string, body: Object): Promise<any> {
    const settings = await this.addonSettings.getAddonSettings({ key: 'clientInfo', clientKey });

    if (settings) {
      const {
        val: { key: issuer, sharedSecret, baseUrl },
      } = settings;

      if (issuer && sharedSecret && baseUrl) {
        const token = await this.getToken(method, path, issuer, sharedSecret);
        const response = await request[method]({
          url: `${baseUrl}${path}`,
          json: body,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
          },
        });

        return response;
      }
    }
    return null;
  }

  async get(path: string, clientKey: string) {
    return this._request('get', path, clientKey);
  }

  async post(path: string, clientKey: string, body: Object) {
    return this._request('post', path, clientKey, body);
  }

  async put(path: string, clientKey: string, body: Object) {
    return this._request('put', path, clientKey, body);
  }

  async delete(path: string, clientKey: string, body: Object) {
    return this._request('delete', path, clientKey, body);
  }
}

helpers.annotate(JiraClient, [domain('AddonSettings')]);

export default JiraClient;
