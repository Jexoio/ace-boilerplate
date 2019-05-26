// @flow

import type { ACERequest } from '../../types';
import JiraIssueDomain from '../../domains/JiraIssue';

export const updateSummary = async (
  obj: Object,
  { id, summary }: { id: string, summary: string },
  { ioc }: ACERequest<{}>,
) => {
  const jiraIssueDomain: JiraIssueDomain = ioc.getDomain('JiraIssue');

  // this operation will trigger a webhook that will update subscriptions
  await jiraIssueDomain.updateSummary(id, summary);
};

export default { Mutation: { updateSummary } };
