# Atlassian Add-on using Express + some sugar
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Build Status](https://travis-ci.org/mtmendonca/ace-boilerplate.svg?branch=master)](https://travis-ci.org/mtmendonca/ace-boilerplate)

## Tech
- [Docker] - Run the stack in containers!
- [docker-compose] - Basic Docker orchestrator
- [Postgresql] - Database
- [Redis] - Database
- [Expressjs] - Nodejs web framework
- [Flow] - Static Type Checker for JavaScript
- [ACE] - Atlassian Express library
- [InversifyJs] - Dependency Injection library
- [ApolloServer] - Graphql server library
- [Ngrok] - http tunneling service

## Quick setup
### Dependencies
Nodejs v10.x: Use [nvm](https://github.com/creationix/nvm) if you can, it's handy for switching between node versions
A Jira Cloud development instance: Click [here](https://developer.atlassian.com/blog/2016/04/cloud-ecosystem-dev-env/) to get one.
Assuming you used nvm, activate v10 and install Yarn globally:
```sh
$ nvm install 10
$ nvm use 10
$ npm install -g yarn
```
Create a copy of `.env.sample` as `.env`
Create a copy of `api/credentials.json.sample` as `credentials.json`
Edit credentials.json:
```json
{
    "hosts": {
        "<YOUR JIRA INSTANCE ENDPOINT>": {
            "product": "jira",
            "username": "<YOUR JIRA USERNAME>",
            "password": "<YOUR JIRA PASSWORD>"
        }
    }
}
```
Run `yarn` in `api` and `app` to install dependencies.
### Start the docker-compose stack
```sh
$ ./start
```
The script above will 
* Install node dependencies on the `api` and `app` directories
* Deploy Postgresql and Redis containers
* Start the server and web applications on containers
* Start an nginx reverse proxy that redirects `/app` requests to the `web` container, and everything else to the `api` container


Use ACE's `AC_OPTS` environment variable on `.env` to control ACE's behaviour.
With the current value of `AC_OPTS=force-reg,force-dereg` an Ngrok tunnel will be created and used as your application's enpoint during development.
Use `AC_OPTS=no-auth` to start the stack locally, skipping authentication and mocking graphql queries and mutations.

This repo comes with a sample [create-react-app](https://github.com/facebook/create-react-app) application that shows some user info and lists the first 10 jira issues from your configured instance.

## Production deployment
When deploying to production make sure you replace `atlassian-connect.json` with a version of the file that matches your production environment.
### Docker
Build the production-ready container using Dockerfile.production
### Standalone
`yarn build` and `yarn prod` start the api listening on the configured port.

## Architecture
This boilerplate creates a dependency injection container named `ioc` and adds it to express' `req`, used in routes and graphql resolvers. This container has methods that return the bootstrapped dependencies placed under:
* `api/src/adapters` for db and redis connections: `getAdapter('adapter-file-name')`
* `api/src/domains` for domain classes for business logic `getDomain('domain-file-name')`
* `api/src/models` for sequelize data models `getModel('model-file-name')`
* `api/src/services` for external integrations `getService('service-file-name')`

The `req` object also gets an object named `ace` which is a per-request authenticated atlas-connect-express plugin instance used by the included `JiraService` to perform api calls to the remote jira instance.

ACE's middleware also includes a `context` object in `req` which contains [jira's context data](https://bitbucket.org/atlassian/atlassian-connect-express). In essence, the following variables are added to express' `req` object:
```js
{
  ioc: ContainerInterface,
  context: ACEContext,
  ace: ?Object,
}
```

`api/entrypoint.sh` runs a database migration prior to launching the stack.
DB Migrations are created using [knex](http://knexjs.org/) and the node script `db` is an alias to it.

## JiraService
The JiraService instance you get from `req.ioc.getService('Jira')` gives you `get`, `post` and `put` methods that proxy `ace`'s httpClient methods. There are utility methods in `api/src/services/utils/jiraServiceUtils`:
* `getBodyJson`: returns jira api response body as an object
* `getResultWithoutPagination`: Paginates through jira's response until there are no more records left and returns the accumulated responses as an object

## JiraClient
`api/services/JiraClient`'s instance obtained with `ioc.getService('JiraClient')` is a Jira Api client wrapper to be used outside an instance's http request lifecyle such as scheduled jobs.
Use this class' http method wrappers to interact with Jira's api providing a clientKey and `JiraClient` will look up the right information from AddonSettings, sign the request and return the resulting request's response body in a promise.

## Yarn scripts
### /api
|command|purpose|
|---|---|
|dev|Starts the stack locally according to the `AC_OPTS` config in `.env` |
|dev-debug| same as `dev` but with node's `--inspection` enabled and listening on port 9229|
|test|Runs automated tests|
|cover|Runs automated tests and outputs test coverage with istambul|
|db|Alias to `knex`|
|db-migrate|Runs the latest migrations|
|db-migrate-create `<migration-name>`|Creates an empty database migration on `/db/migrations`|
|build|Creates production build in `api/dist/`|
|prod|Starts production build  by running `node api/dist/src/app.js`|

### /app
Default create-react-app scripts

[docker]: https://www.docker.com
[docker-compose]: https://docs.docker.com/compose/install/
[metabase]: https://www.metabase.com
[postgresql]: https://www.postgresql.org/
[redis]: https://redis.io/
[expressjs]: https://expressjs.com
[ace]: https://bitbucket.org/atlassian/atlassian-connect-express
[inversifyjs]: https://github.com/inversify/InversifyJS
[apolloserver]: https://www.apollographql.com/docs/apollo-server/
[ngrok]: https://ngrok.com/
[flow]: https://flow.org/
