// @flow
/* eslint-disable no-console */
import { decode, verify } from 'jsonwebtoken';
import type { WSContext } from '../types';
import type { ContainerInterface } from '../ioc';
import ioc from '../middleware/ioc';

export const onConnect = async ({ JWT }: { JWT: string }, websocket: any, context: Object): Promise<WSContext> => {
  try {
    const augmentedContext: WSContext = { ...context, ioc: {}, clientKey: '' };
    ioc()(augmentedContext, null, () => ({}));
    const container: ContainerInterface = augmentedContext.ioc;
    // authenticate websocket connections only when no-auth is not set
    if ((process.env.AC_OPTS || '').includes('no-auth') === false) {
      console.log(`Establishing websocket connection for ${JWT}`);
      // get clientKey from token
      const { aud } = decode(JWT);
      const clientKey = aud.pop();
      // get sharedSecret from AddonSettings
      const addonSettingsDomain = container.getDomain('AddonSettings');
      const sharedSecret = await addonSettingsDomain.getSharedSecret(clientKey);
      // verify token
      if (verify(JWT, sharedSecret)) {
        augmentedContext.clientKey = clientKey;
      } else {
        console.error('Websocket connection failed. JWT Token verification failed');
        throw new Error('Websocket token verification failed');
      }
    }
    console.log('Websocket connection authorized');
    return augmentedContext;
  } catch (e) {
    console.error(`Error while authorizing websocket connection for ${JWT}`, e);
    throw new Error('Error while authorizing websocket connection');
  }
};
export const onDisconnect = () => {
  console.log('ws disconnected'); // eslint-disable-line
};
