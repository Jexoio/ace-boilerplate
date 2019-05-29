// @flow

const JiraIssue = /* GraphQL */ `
  type JiraIssue {
    id: String!
    self: String!
    key: String!
    summary: String
  }

  extend type Query {
    issues: [JiraIssue]
  }

  extend type Mutation {
    updateSummary(id: String, summary: String): JiraIssue
  }

  extend type Subscription {
    jiraIssueUpdated(clientKey: String!): JiraIssue!
  }
`;

export default JiraIssue;
