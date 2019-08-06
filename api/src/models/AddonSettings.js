// @flow
import Sequelize from 'sequelize';
import { interfaces } from 'inversify';
import type { SequelizeModel } from '../types';
import type { Interface as UserType } from './User';

export type AddonSettings = {
  id?: string,
  clientKey: string,
  key: string,
  val: {
    baseUrl?: string,
    key?: string,
    sharedSecret?: string,
  },
};
export type Interface = SequelizeModel<AddonSettings> & AddonSettings;

export default (context: interfaces.Context): Interface => {
  const db = context.container.getAdapter('db');
  const AddonSettingsModel: Interface = db.define(
    'AddonSettings',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      clientKey: Sequelize.STRING,
      key: Sequelize.STRING,
      val: Sequelize.JSON,
    },
    {
      underscored: false,
      tableName: 'AddonSettings',
    },
  );
  // this function gets called after all models have been loaded by ioc
  AddonSettingsModel.associate = ({ User }: { User: SequelizeModel<UserType> }) => {
    AddonSettingsModel.hasMany(User, {
      as: 'addonSettings',
      foreignKey: 'client_key',
      sourceKey: 'clientKey',
    });
  };
  return AddonSettingsModel;
};
