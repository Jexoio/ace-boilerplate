// @flow

import { lstatSync, readdirSync } from 'fs';
import { join, extname } from 'path';

export type Directory = {
  name: string,
  path: string,
};

// $FlowIgnore
export const getDirectories = (source: string): [Directory] => readdirSync(source)
  .filter(name => lstatSync(join(source, name)).isDirectory())
  .map(name => ({ name, path: join(source, name) }));
// $FlowIgnore
export const getFiles = (source: string): [Directory] => readdirSync(source)
  .filter(name => extname(name) === '.js')
  .map(name => ({ name, path: join(source, name) }));

export const adapter = (name: string): string => `${name}Adapter`;
export const model = (name: string): string => `${name}Model`;
export const domain = (name: string): string => `${name}Domain`;
export const service = (name: string): string => `${name}Service`;
