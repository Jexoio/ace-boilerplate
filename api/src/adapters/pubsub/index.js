// @flow

import { RedisPubSub } from 'graphql-redis-subscriptions';

export default new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
