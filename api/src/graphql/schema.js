// @flow
import { makeExecutableSchema } from 'apollo-server-express';
import { merge } from 'lodash';
import { join } from 'path';
import { getFiles } from '../ioc/utils';

const TYPES = 'types';
const QUERIES = 'queries';
const MUTATIONS = 'mutations';
const SUBSCRIPTIONS = 'subscriptions';
const SCALAR_RESOLVERS = 'scalar-resolvers';

const schemaComponents = {
  [TYPES]: [],
  [QUERIES]: [],
  [MUTATIONS]: [],
  [SUBSCRIPTIONS]: [],
  [SCALAR_RESOLVERS]: [],
};

Object.keys(schemaComponents).forEach((key) => {
  const items = getFiles(join(__dirname, `./${key}`));
  items.forEach(({ path }) => {
    // $FlowIgnore
    schemaComponents[key].push(require(path).default); // eslint-disable-line
  });
});

const Root = /* GraphQL */ `
  type Query {
    dummy: String
  }
  type Mutation {
    dummy: String
  }
  type Subscription {
    dummy: String
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const resolvers = merge(
  {},
  ...schemaComponents[QUERIES],
  ...schemaComponents[MUTATIONS],
  ...schemaComponents[SUBSCRIPTIONS],
  ...schemaComponents[SCALAR_RESOLVERS],
);

const schema = makeExecutableSchema({
  typeDefs: [Root, ...schemaComponents[TYPES]],
  resolvers,
});

export default schema;
