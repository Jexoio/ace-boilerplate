// @flow
import React, { Component } from 'react';
import ApolloClient from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import Theme from './providers/Theme';
import HelloWorld from './pages/HelloWorld';
import Expired from './pages/Expired';

const AuthLink = (operation, next) => {
  const token = localStorage.getItem('token') || '';

  operation.setContext(context => ({
    ...context,
    headers: {
      ...context.headers,
      Authorization: `JWT ${token}`
    }
  }));

  return next(operation);
};

class App extends Component<any, any> {
  client: ApolloClient;
  componentWillMount() {
    const { protocol, host } = window.location;
    const wsProtocol = protocol.includes('https') ? 'wss:' : 'ws:';

    try {
      const [, JWT] = (window.location.search || 'jwt=')
        .match(/jwt=((?!&).)*/gi)[0]
        .split('=');
      localStorage.setItem('token', JWT);
      const httpLink = ApolloLink.from([
        AuthLink,
        new HttpLink({ uri: `${protocol}//${host}/graphql` })
      ]);
      const wsLink = new WebSocketLink({
        uri: `${wsProtocol}//${host}/subscriptions`,
        options: {
          reconnect: true,
          connectionParams: { JWT }
        }
      });
      const link = split(
        // split based on operation type
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLink
      );
      this.client = new ApolloClient({
        link,
        cache: new InMemoryCache().restore({})
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <div>
        <Theme.Provider>
          <ApolloProvider client={this.client}>
            <div className="App">
              <Router>
                <div>
                  <Route path="/app" exact component={HelloWorld} />
                  <Route path="/app/expired" exact component={Expired} />
                </div>
              </Router>
            </div>
          </ApolloProvider>
        </Theme.Provider>
      </div>
    );
  }
}

export default App;
