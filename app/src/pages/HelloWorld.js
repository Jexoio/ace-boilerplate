// @flow
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Query } from 'react-apollo';

import UserInfo from '../components/UserInfo';
import IssueTable from '../components/IssueTable';
import Theme from '../providers/Theme';
import { ME_QUERY, JIRA_ISSUES_QUERY } from '../graphql/queries';
import { JIRA_ISSUE_UPDATE_SUMMARY } from '../graphql/mutations';
import { JIRA_ISSUE_UPDATED_SUBSCRIPTION } from '../graphql/subscriptions';

const withUpdateSummary = graphql(JIRA_ISSUE_UPDATE_SUMMARY, {
  name: 'updateSummary'
});
const ComposedIssuesTable = compose(withUpdateSummary)(IssueTable);
class HelloWorld extends Component<any, any> {
  clientKey: string;
  componentWillMount() {
    const JWT = localStorage.getItem('token') || '';
    this.clientKey =
      window.location.hostname === 'localhost'
        ? ''
        : JSON.parse(atob(JWT.split('.')[1])).aud[0]; //this should probably be in a separate provider
  }
  render() {
    const clientKey = this.clientKey;
    return (
      <div>
        <Theme.Provider>
          <Page>
            <Grid>
              <GridColumn medium={12}>
                <div className="App">
                  <Query query={ME_QUERY}>
                    {({ loading, error, data, subscribeToMore }) => {
                      if (loading) return <p>Loading...</p>;
                      if (error) return <p>Error :(</p>;
                      const { me } = data;
                      return <UserInfo me={me} />;
                    }}
                  </Query>
                  <Query query={JIRA_ISSUES_QUERY}>
                    {({ loading, error, data, subscribeToMore }) => {
                      if (loading) return <p>Loading...</p>;
                      if (error) return <p>Error :(</p>;
                      const { issues } = data;
                      return (
                        <ComposedIssuesTable
                          issues={issues}
                          subscribeToJiraIssueUpdate={() => {
                            subscribeToMore({
                              document: JIRA_ISSUE_UPDATED_SUBSCRIPTION,
                              variables: { clientKey }
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
        </Theme.Provider>
      </div>
    );
  }
}

export default HelloWorld;
