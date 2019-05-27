// @flow
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import type { JiraServiceInterface as JiraService } from '../types';
import { service } from '../ioc/utils';
import { getBodyJson } from '../services/utils/jiraServiceUtils';

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
  jiraService: JiraService;

  constructor(jiraService: JiraService) {
    this.jiraService = jiraService;
  }

  async getIssues(startAt: number, maxResults: number): Promise<Array<?JiraIssue>> {
    const response = await this.jiraService.get(`/rest/api/2/search?startAt=${startAt}&maxResults=${maxResults}`);
    const { issues } = JSON.parse(response);
    return issues;
  }

  updateSummary(id: string, summary: string): Promise<JiraIssue> {
    return this.jiraService.put({
      url: `/rest/api/2/issue/${id}`,
      body: { fields: { summary } },
      json: true,
    });
  }
}
helpers.annotate(JiraIssueDomain, [service('Jira')]);

export default JiraIssueDomain;
