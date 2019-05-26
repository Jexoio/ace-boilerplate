import helmet from 'helmet';
import cors from 'cors';
import ioc from './ioc';
import addon from './addon';
import jiraService from './jiraService';

export default (app, ace) => {
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
      expectCt: false,
      dnsPrefetchControl: false,
      frameguard: {
        action: 'ALLOW-FROM',
        domain: 'atlassian.net',
      },
      hidePoweredBy: {
        setTo: 'Green Ether',
      },
      hpkp: false,
      hsts: process.env.ENVIRONMENT === 'production',
      ieNoOpen: true,
      noCache: false,
      noSniff: true,
      xssFilter: true,
    }),
  );
  app.use(/^(?!\/(atlassian-connect\.json|installed).*)/, ace.checkValidToken());
  app.use(ioc());
  app.use(addon(ace));
  app.use(jiraService);
};
