import gql from 'graphql-tag';

export const JIRA_ISSUE_UPDATE_SUMMARY = gql`
  mutation updateSummary($id: String!, $summary: String!) {
    updateSummary(id: $id, summary: $summary) {
      id
      self
      key
      summary
    }
  }
`;