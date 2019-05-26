// @flow
import type { ACERequest } from '../types';
import { service } from '../ioc/utils';

export default (req: ACERequest<{}>, res: Object, next: Function) => {
  const { ioc } = req;
  if (req.context.clientKey) {
    const jiraService = ioc.getServiceFactory('Jira')(req);
    ioc.rebindIfBound(service('Jira')).toConstantValue(jiraService);
  }
  next();
};
