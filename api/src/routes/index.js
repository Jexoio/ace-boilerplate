import { readdirSync } from 'fs';
import { basename } from 'path';

const isRoute = file => file.match(/^((?!index).)*\.js/);
const files = readdirSync(__dirname);
export default (app, addon) => {
  Object.keys(files).forEach((index) => {
    const file = files[index];
    if (isRoute(file)) {
      console.log(`Registering routes defined in ${file}`); // eslint-disable-line
      const routes = require(`./${basename(file)}`).default; // eslint-disable-line
      if (typeof routes === 'function') {
        routes(app, addon);
      }
    }
  });
};
