// @flow
import { Router } from 'express';
import type { Router as $Router, $Response, $Application } from 'express';
// $FlowIgnore
import atlassianConnectJson from '../../atlassian-connect.json';
import UserDomain from '../domains/User';
import type { ACE, ACERequest } from '../types';

export const getQueryString = ({ query, context: { token } }: ACERequest<{}>): string => {
  const keys = Object.keys(query);
  return keys.reduce((acc: string, cur: string) => {
    // replace jira session jwt with addon generated token that respects expiration time
    // set in atlassian-connect.json
    const value: string = cur === 'jwt' ? token : query[cur];
    return `${acc}&${cur}=${value}`;
  }, '');
};

/**
 * Returns the contents of ../../atlassian-connect.json to be consumed
 * by Jira cloud during the plugin's installation
 *
 * @param {ACERequest} req
 * @param {$Response} res
 */
export const getAtlasConnectJson = (req: ACERequest<{}>, res: $Response) => {
  res.send(atlassianConnectJson);
};
/**
 * This is an example route that's used by the default "generalPage" module.
 *
 * @param {ACERequest} req
 * @param {$Response} res
 */
export const helloWorld = async (req: ACERequest<{}>, res: $Response) => {
  const {
    ioc,
    context: { userAccountId, clientKey },
  } = req;

  const userDomain: UserDomain = ioc.getDomain('User');
  const currentUser = await userDomain.findOne({ userAccountId });

  if (!currentUser) {
    try {
      userDomain.create({
        userAccountId,
        clientKey,
      });
    } catch (e) {
      // report it
      console.log('Could not create user', e); // eslint-disable-line no-console
    }
  }

  res.redirect(`/app?${getQueryString(req)}`);
};

export const expired = async (req: ACERequest<{}>, res: $Response) => {
  res.redirect(`/app/expired?${getQueryString(req)}`);
};

const AtlasRouter: $Router = Router();
export default (app: $Application, addon: ACE) => {
  AtlasRouter.get('/', getAtlasConnectJson);
  // Verify that the incoming request is authenticated with Atlassian Connect
  AtlasRouter.get('/hello-world', addon.authenticate(), helloWorld);
  AtlasRouter.get('/expired', addon.authenticate(), expired);
  app.use(AtlasRouter);
};
