// @flow
import { withFilter } from 'graphql-subscriptions';
import type { WSContext, SubscriptionVariables } from '../../types';
import type { JiraIssue } from '../../domains/JiraIssue';

export const JIRA_ISSUE_UPDATED = 'jira-issue-updated';

export const jiraIssueUpdated = {
  resolve: (payload: JiraIssue) => payload,
  subscribe: withFilter(
    (root, args, { ioc }: WSContext): any => {
      const pubsub = ioc.getAdapter('pubsub');
      return pubsub.asyncIterator(JIRA_ISSUE_UPDATED);
    },
    (
      payload: JiraIssue,
      { clientKey }: SubscriptionVariables,
      { clientKey: ctxKey }: WSContext,
    ): boolean => clientKey === ctxKey,
  ),
};

export default { Subscription: { jiraIssueUpdated } };
