import gql from 'graphql-tag';

export const JIRA_ISSUE_UPDATED_SUBSCRIPTION = gql`
  subscription($clientKey: String!) {
    jiraIssueUpdated(clientKey: $clientKey) {
      id
      self
      key
      summary
    }
  }
`;
