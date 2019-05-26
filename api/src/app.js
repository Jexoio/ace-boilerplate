import 'regenerator-runtime/runtime';
import { hostname } from 'os';
import http from 'http';
import express from 'express';
import AtlasConnectExpress from 'atlassian-connect-express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import addMiddleware from './middleware';
import addRoutes from './routes';
import createServer from './server';

// create express application
const app = express();
// secure your app with helmet defaults at least
app.use(helmet());
app.set('env', process.env.ENVIRONMENT); // atlas-connect-express needs this
// get atlas-connect addon instance
const ace = AtlasConnectExpress(app);
// add default atlas-connect middleware
app.use(ace.middleware());
// add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// add application middleware
addMiddleware(app, ace);
// add routes defined in ./routes. Pass addon for authentication and jira api requests
addRoutes(app, ace);
// create graphql server
const server = createServer(app, ace);
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// start the server
const PORT = process.env.API_PORT || 3000;
httpServer.listen({ port: PORT }, () => {
  console.log(`Add-on server running at http://${hostname()}:${PORT}`); // eslint-disable-line no-console
  if (process.env.ENVIRONMENT === 'development' && (process.env.AC_OPTS || '').includes('force-reg')) {
    ace.register();
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection', err); // eslint-disable-line no-console
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err); // eslint-disable-line no-console
  process.exit(1);
});
