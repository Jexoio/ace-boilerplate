// @flow

import type { ACERequest } from '../../types';
import UserDomain from '../../domains/User';
import { USER_UPDATED } from '../subscriptions/User';

export const update = async (
  obj: Object,
  { id }: { id: string },
  { ioc }: ACERequest<{}>,
): Promise<?Object> => ioc.getAdapter('db').transaction(async () => {
  const userDomain: UserDomain = ioc.getDomain('User');
  const user = await userDomain.findOne({ id });

  if (user) {
    const updatedUser = await userDomain.update(user);
    const pubsub = ioc.getAdapter('pubsub');
    pubsub.publish(USER_UPDATED, updatedUser);
    return updatedUser;
  }

  return null;
});

export default { Mutation: { update } };
