// @flow
import { helpers } from 'inversify-vanillajs-helpers';
import 'reflect-metadata';
import { model } from '../ioc/utils';
import type { Interface as UserModel, User } from '../models/User';

export interface Interface {
  create(user: User): Function;
  findAll(where: Object): Function;
  findById(id: string): Function;
  findOne(where: Object): Function;
  update: Function;
}

class UserDomain implements Interface {
  userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  create(user: User): Promise<UserModel> {
    return this.userModel.create(user);
  }

  findAll(where: Object): Promise<Array<?UserModel>> {
    return this.userModel.findAll({ where });
  }

  findById(id: string): Promise<?UserModel> {
    return this.userModel.findById(id);
  }

  findOne(where: Object): Promise<?UserModel> {
    return this.userModel.findOne({ where });
  }

  update = (user: UserModel): Promise<UserModel> => user.save();
}

helpers.annotate(UserDomain, [model('User')]);

export default UserDomain;
