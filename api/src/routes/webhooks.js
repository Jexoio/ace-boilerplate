// @flow

import { Router } from 'express';
import type { Router as $Router, $Response, $Application } from 'express';
import { JIRA_ISSUE_UPDATED } from '../graphql/subscriptions/JiraIssue';
import type { ACE, ACERequest, JiraApiIssue } from '../types';
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

export const issueUpdated = ({ ioc, body }: ACERequest<{ issue: JiraApiIssue }>, res: $Response) => {
  const pubsub = ioc.getAdapter('pubsub');
  if (body && body.issue) {
    pubsub.publish(JIRA_ISSUE_UPDATED, body.issue);
    res.status(200).send('OK');
  }
  res.status(204).end();
};

const HooksRouter: $Router = Router();
export default (app: $Application, addon: ACE) => {
  HooksRouter.post('/enabled', addon.authenticate(), enabled);
  HooksRouter.post('/disabled', addon.authenticate(), disabled);
  HooksRouter.post('/issue-updated', addon.authenticate(), issueUpdated);
  app.use(HooksRouter);
};
