// @flow

import { createNamespace } from 'cls-hooked';
import Sequelize from 'sequelize';
import uuid from 'uuid';
import { SequelizeModel } from '../../types';

const session = createNamespace('atlas-express-app');
Sequelize.useCLS(session);

/**
 * If the model has an id field, presume it's a uuid field and populate it
 */
export const beforeCreate = (instance: SequelizeModel<any>, { fields }: { fields: [string] }) => {
  if (instance.constructor.name !== 'AddonSettings' && fields.includes('id')) {
    instance.id = uuid.v4(); // eslint-disable-line
  }
};

export default new Sequelize(process.env.DATABASE_URL, {
  dialect: process.env.DB_DIALECT,
  define: {
    underscored: true,
    freezeTableName: false,
    charset: process.env.DB_CHARSET || 'utf8',
    dialectOptions: {
      collate: process.env.DB_DIALECT_OPTIONS_COLLATE || 'utf8_general_ci',
    },
    timestamps: true,
    hooks: {
      beforeCreate,
    },
  },
  // pool configuration used to pool database connections
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || 5, 10),
    idle: 30000,
    acquire: 60000,
  },
});
