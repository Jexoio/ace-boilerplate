// @flow
import Sequelize from 'sequelize';
import { interfaces } from 'inversify';
import type { SequelizeModel } from '../types';

export type User = {
  id?: string,
  userAccountId: string,
  clientKey: string,
};

export type Interface = SequelizeModel<User> & User;

export default (context: interfaces.Context): Interface => {
  const db = context.container.getAdapter('db');
  const UserModel: Interface = db.define(
    'users',
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: true,
        unique: true,
      },
      userAccountId: Sequelize.TEXT,
      clientKey: Sequelize.TEXT,
    },
    { timestamps: true },
  );
  return UserModel;
};
