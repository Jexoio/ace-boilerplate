// @flow
import { promisify } from 'util';
import type {
  JiraServiceInterface, JiraApiResponse, ACE, ACERequest,
} from '../types';

/**
 * Wrapper around Jira's HTTP Client
 * https://developer.atlassian.com/cloud/jira/platform/rest/v2/
 *
 * @export
 * @class JiraService
 */
export class JiraService implements JiraServiceInterface {
  _ace: ACE;

  get: (input: string | Object) => Promise<JiraApiResponse>;

  put: (input: string | Object) => Promise<JiraApiResponse>;

  post: (input: string | Object) => Promise<JiraApiResponse>;

  constructor(ace: ACE) {
    this._ace = ace;
    // promisify ace's get and post functions
    this.get = promisify(this._ace.get).bind(this._ace);
    this.put = promisify(this._ace.put).bind(this._ace);
    this.post = promisify(this._ace.post).bind(this._ace);
  }

  asUserByAccountId(userAccountId: string): Function {
    return this._ace.asUserByAccountId(userAccountId);
  }
}

export default (): any => ({ ace }: ACERequest<{}>) => new JiraService(ace);
