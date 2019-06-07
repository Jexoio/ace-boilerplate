/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server-express';
import { addMockFunctionsToSchema } from 'graphql-tools';
import schema from './graphql/schema';
import mocks from './graphql/mocks';
import { onConnect, onDisconnect } from './utils/subscriptions';

const createServer = (app) => {
  if (process.env.USE_GRAPHQL_MOCKS) {
    console.log('Adding mock functions to schema');
    addMockFunctionsToSchema({ schema, mocks });
  }

  const server = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      if (connection) {
        // Websocket connection
        const { context } = connection;
        return context;
      }
      return req;
    },
    playground: process.env.ENVIRONMENT === 'development',
    subscriptions: {
      path: '/subscriptions',
      onConnect,
      onDisconnect,
    },
    formatError: (err) => {
      console.log('%j', err);
      return new Error('There was an error');
    },
  });

  server.applyMiddleware({ app, path: '/graphql' });

  return server;
};

export default createServer;
