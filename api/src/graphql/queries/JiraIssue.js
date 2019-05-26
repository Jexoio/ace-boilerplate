// @flow

import type { ACERequest } from '../../types';
import type { JiraIssueDomainInterface, JiraIssue } from '../../domains/JiraIssue';

export const issues = (obj: Object, args: Object, req: ACERequest<{}>): Promise<Array<?JiraIssue>> => {
  const { ioc } = req;
  const jiraIssuesDomain: JiraIssueDomainInterface = ioc.getDomain('JiraIssue');
  return jiraIssuesDomain.getIssues(0, 20);
};

export const summary = ({ fields }: { fields: { summary: string } }): string => fields.summary;

export default {
  Query: {
    issues,
  },
  JiraIssue: {
    summary,
  },
};
