// @flow
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import { model } from '../ioc/utils';
import type { Interface as UserModel } from '../models/User';

export interface Interface {
  create(user: Object): Promise<Object>;
  findAll(where: Object): Promise<Object>;
  findByPk(id: string): Promise<Object>;
  findOne(where: Object): Promise<Object>;
  update: (user: Object) => Promise<Object>;
}

class UserDomain implements Interface {
  userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  create(user: Object): Promise<UserModel> {
    return this.userModel.create(user);
  }

  findAll(where: Object): Promise<Array<?UserModel>> {
    return this.userModel.findAll({ where });
  }

  findByPk(id: string): Promise<?UserModel> {
    return this.userModel.findByPk(id);
  }

  findOne(where: Object): Promise<?UserModel> {
    return this.userModel.findOne({ where });
  }

  update = (user: UserModel): Promise<UserModel> => user.save();
}

helpers.annotate(UserDomain, [model('User')]);

export default UserDomain;
