// @flow
import { withFilter } from 'graphql-subscriptions';
import type { WSContext, SubscriptionVariables } from '../../types';
import type { User } from '../../models/User';

export const USER_UPDATED = 'user-updated';

export const userUpdated = {
  resolve: (payload: User) => payload,
  subscribe: withFilter(
    (root, args, { ioc }: WSContext) => {
      const pubsub = ioc.getAdapter('pubsub');
      return pubsub.asyncIterator(USER_UPDATED);
    },
    (
      payload: User,
      { clientKey }: SubscriptionVariables,
      { clientKey: ctxKey }: WSContext,
    ): boolean => clientKey === ctxKey,
  ),
};

export default { Subscription: { userUpdated } };
