// @flow
import type { ACERequest } from '../types';
import { service } from '../ioc/utils';
import createAddonService from '../factories/AddonServiceFactory';

export default (ace: any) => (req: ACERequest<{}>, res: Object, next: Function): void => {
  const { ioc } = req;
  // context.clientKey is not available during installation requests
  if (req.context.clientKey) {
    const addonService = createAddonService(ace.httpClient(req));
    ioc.rebindIfBound(service('Addon')).toConstantValue(addonService);
  }
  next();
};
