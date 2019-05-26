// @flow

import type { ACERequest } from '../../types';
import type { Interface as UserModel } from '../../models/User';
import UserDomain from '../../domains/User';

export const me = (
  obj: Object,
  args: Object,
  { ioc, context: { userAccountId } }: ACERequest<{}>,
): Promise<?UserModel> => {
  const userDomain: UserDomain = ioc.getDomain('User');
  return userDomain.findOne({ userAccountId });
};

export default { Query: { me } };
