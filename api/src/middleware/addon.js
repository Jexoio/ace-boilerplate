// @flow
import type { ACERequest } from '../types';
import { service } from '../ioc/utils';
import createAddonService from '../factories/AddonServiceFactory';

export default (ace: any) => (req: ACERequest<{}>, res: Object, next: Function): void => {
  const { ioc } = req;
  // context.clientKey is not available during installation requests
  if (req.context.clientKey) {
    ioc.rebindIfBound(service('Addon')).toDynamicValue(() => createAddonService(ace.httpClient(req)));
  }
  next();
};
