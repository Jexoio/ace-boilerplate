// @flow
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Query, graphql, compose } from 'react-apollo';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import UserInfo from '../components/UserInfo';
import IssueTable from '../components/IssueTable';
import { ME_QUERY, JIRA_ISSUES_QUERY } from '../graphql/queries';
import { JIRA_ISSUE_UPDATE_SUMMARY } from '../graphql/mutations';
import { JIRA_ISSUE_UPDATED_SUBSCRIPTION } from '../graphql/subscriptions';

const { localStorage, location, atob } = window; // eslint-disable-line no-undef

const withUpdateSummary = graphql(JIRA_ISSUE_UPDATE_SUMMARY, {
  name: 'updateSummary',
});

const ComposedIssuesTable = compose(withUpdateSummary)(IssueTable);
class HelloWorld extends Component<any, any> {
  clientKey: string;

  UNSAFE_componentWillMount() {
    const JWT = localStorage.getItem('token') || '';
    this.clientKey = location.hostname === 'localhost'
      ? ''
      : JSON.parse(atob(JWT.split('.')[1])).aud[0]; // this should probably be in a separate provider
  }

  render() {
    const { clientKey } = this;
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
                <Query query={JIRA_ISSUES_QUERY}>
                  {({
                    loading, error, data, subscribeToMore,
                  }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    const { issues } = data;
                    return (
                      <ComposedIssuesTable
                        issues={issues}
                        subscribeToJiraIssueUpdate={() => {
                          subscribeToMore({
                            document: JIRA_ISSUE_UPDATED_SUBSCRIPTION,
                            variables: { clientKey },
                          });
                        }}
                      />
                    );
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
