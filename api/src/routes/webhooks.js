// @flow

import { Router } from 'express';
import type { Router as $Router, $Response, $Application } from 'express';
import type { ACE, ACERequest } from '../types';
import type { Interface as AddonSettingsInterface } from '../domains/AddonSettings';

export const enabled = (
  {
    ioc,
    context: {
      clientKey,
      userAccountId,
      http: {
        addon: {
          descriptor: {
            apiVersion,
          },
        },
      },
    },
  }: ACERequest<{}>,
  res: $Response,
) => {
  const addonSettings: AddonSettingsInterface = ioc.getDomain('AddonSettings');
  addonSettings.saveInstallData(clientKey, userAccountId, apiVersion);
  res.status(200).send('Addon Enabled!');
};

export const disabled = (
  {
    ioc,
    context: {
      clientKey,
      userAccountId,
      http: {
        addon: {
          descriptor: {
            apiVersion,
          },
        },
      },
    },
  }: ACERequest<{}>,
  res: $Response,
) => {
  const addonSettings: AddonSettingsInterface = ioc.getDomain('AddonSettings');
  addonSettings.saveUninstallData(clientKey, userAccountId, apiVersion);
  res.status(200).send('Addon Disabled!');
};

const HooksRouter: $Router = Router();
export default (app: $Application, addon: ACE) => {
  HooksRouter.post('/enabled', addon.authenticate(), enabled);
  HooksRouter.post('/disabled', addon.authenticate(), disabled);
  app.use(HooksRouter);
};
