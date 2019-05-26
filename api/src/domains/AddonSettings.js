// @flow
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import { model } from '../ioc/utils';
import type { Interface as AddonSettingsModel } from '../models/AddonSettings';

export const INSTALL_DATA = 'install-data';
export const UNINSTALL_DATA = 'uninstall-data';

export interface Interface {
  getAddonSettings(where: Object): Promise<?AddonSettingsModel>;
  getSharedSecret(clientkey: string): Promise<string>;
  saveInstallData(clientKey: string, userAccountId: string, apiVersion: number): Promise<AddonSettingsModel>;
  saveUninstallData(clientKey: string, userAccountId: string, apiVersion: number): Promise<AddonSettingsModel>;
}

class AddonSettingsDomain implements Interface {
  addonSettingsModel: AddonSettingsModel;

  constructor(addonSettingsModel: AddonSettingsModel) {
    this.addonSettingsModel = addonSettingsModel;
  }

  async getAddonSettings(where: Object): Promise<?AddonSettingsModel> {
    return this.addonSettingsModel.findOne({ where });
  }

  async getSharedSecret(clientKey: string): Promise<string> {
    const settings = await this.getAddonSettings({
      clientKey,
      key: 'clientInfo',
    });

    if (settings && settings.val && settings.val.sharedSecret) {
      return settings.val.sharedSecret;
    }

    return '';
  }

  async saveInstallData(clientKey: string, userAccountId: string, apiVersion: number): Promise<AddonSettingsModel> {
    return this.addonSettingsModel.create({
      clientKey,
      key: INSTALL_DATA,
      val: { date: Date.now(), userAccountId, apiVersion },
    });
  }

  async saveUninstallData(clientKey: string, userAccountId: string, apiVersion: number): Promise<AddonSettingsModel> {
    return this.addonSettingsModel.create({
      clientKey,
      key: UNINSTALL_DATA,
      val: { date: Date.now(), userAccountId, apiVersion },
    });
  }
}

helpers.annotate(AddonSettingsDomain, [model('AddonSettings')]);

export default AddonSettingsDomain;
