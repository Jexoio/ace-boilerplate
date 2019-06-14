// @flow
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import type { AddonServiceInterface as AddonService } from '../types';
import { service } from '../ioc/utils';

export type JiraIssue = {
  id: string,
  self: string,
  key: string,
  summary: string,
};

export interface JiraIssueDomainInterface {
  getIssues(startAt: number, maxResults: number): Promise<Array<?JiraIssue>>;
}

class JiraIssueDomain implements JiraIssueDomainInterface {
  addonService: AddonService;

  constructor(addonService: AddonService) {
    this.addonService = addonService;
  }

  async getIssues(startAt: number, maxResults: number): Promise<Array<?JiraIssue>> {
    const { issues } = await this.addonService.get(`/rest/api/3/search?startAt=${startAt}&maxResults=${maxResults}`);
    return issues;
  }

  updateSummary(id: string, summary: string): Promise<JiraIssue> {
    return this.addonService.put({
      url: `/rest/api/3/issue/${id}`,
      body: { fields: { summary } },
      json: true,
    });
  }
}
helpers.annotate(JiraIssueDomain, [service('Addon')]);

export default JiraIssueDomain;
