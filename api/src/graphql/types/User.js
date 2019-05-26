// @flow

const User = /* GraphQL */ `
  type User {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime
    userAccountId: String!
    clientKey: String!
  }

  extend type Query {
    me: User!
  }

  extend type Mutation {
    update(id: String): User!
  }

  extend type Subscription {
    userUpdated: User!
  }
`;

export default User;
