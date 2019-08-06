import gql from 'graphql-tag';

export const ME_QUERY = gql`
  {
    me {
      id
      userAccountId
      clientKey
      updatedAt
    }
  }
`;

export const JIRA_ISSUES_QUERY = gql`
  {
    issues {
      id
      self
      key
      summary
    }
  }
`;
