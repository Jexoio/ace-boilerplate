// @flow
import AddonService from './AddonService';
import type { ACEHttp } from '../types';


export default (http: ACEHttp) => new AddonService(http);
