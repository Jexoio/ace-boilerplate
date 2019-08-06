// @flow
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import UserInfo from '../components/UserInfo';
import { ME_QUERY } from '../graphql/queries';

const { localStorage, location, atob } = window; // eslint-disable-line no-undef

class HelloWorld extends Component<any, any> {
  clientKey: string;

  UNSAFE_componentWillMount() {
    const JWT = localStorage.getItem('token') || '';
    this.clientKey = location.hostname === 'localhost'
      ? ''
      : JSON.parse(atob(JWT.split('.')[1])).aud[0]; // this should probably be in a separate provider
  }

  render() {
    return (
      <div>
        <Page>
          <Grid>
            <GridColumn medium={12}>
              <div className="App">
                <Query query={ME_QUERY}>
                  {({
                    loading, error, data,
                  }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    const { me } = data;
                    return <UserInfo me={me} />;
                  }}
                </Query>
              </div>
            </GridColumn>
          </Grid>
        </Page>
      </div>
    );
  }
}

export default HelloWorld;
