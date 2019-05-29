// @flow
/* eslint-disable camelcase */
import React, { Component } from 'react';
import InlineEdit, { SingleLineTextInput } from '@atlaskit/inline-edit';
import styled from 'styled-components';
import Theme from '../providers/Theme';

type IssueType = {
  summary: string,
  id: string,
  key: string
};
type IssueProps = {
  issue: IssueType,
  updateSummary: Function
};
type IssueState = {
  summary: string,
  previousSummary: string
};
type IssuesTableProps = {
  updateSummary: Function,
  subscribeToJiraIssueUpdate: Function,
  issues: Array<IssueType>
};

const Panel = styled.div`
  h1 {
    position: relative;
    border-radius: 6px 6px 0 0;
    border: 1px solid transparent;
    background-color: ${({ theme }) => `${theme.panel.header.backgroundColor}`};
    color: ${({ theme }) => `${theme.panel.header.textColor}`};
    padding: 16px;
    margin: 0px;
  }
  .body {
    padding: 16px;
    border: ${({ theme }) => `1px solid ${theme.panel.body.borderColor}`};
  }
`;

const IssueRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
  height: 40px;
  > * {
    flex: 1;
    line-height: 40px;
  }
  .summary {
    flex: 2;
  }
`;

export class Issue extends Component<IssueProps, IssueState> {
  state = {
    summary: this.props.issue.summary,
    previousSummary: this.props.issue.summary,
  };

  UNSAFE_componentWillUpdate({ issue }: IssueProps, { summary }: IssueState) {
    if (issue.summary !== summary && summary === this.state.summary) {
      this.setState({ summary: issue.summary, previousSummary: issue.summary });
    }
  }

  handleChange = (e: any) => {
    const summary = e.target.value;
    this.setState({ summary });
  };

  handleConfirm = () => {
    this.props.updateSummary({
      variables: { id: this.props.issue.id, summary: this.state.summary },
    });
  };

  handleCancel = () => {
    this.setState({ summary: this.state.previousSummary });
  };

  render() {
    const { issue } = this.props;
    return (
      <IssueRow key={issue.id}>
        <div>{issue.id}</div>
        <div>{issue.key}</div>
        <div className="summary">
          <InlineEdit
            isFitContainerWidthReadView
            isLabelHidden
            editView={
              <SingleLineTextInput
                id="1"
                isEditing
                isInitiallySelected
                value={this.state.summary}
                onChange={this.handleChange}
              />
            }
            readView={
              <SingleLineTextInput
                id="1"
                isEditing={false}
                isInitiallySelected
                value={this.state.summary}
                onChange={this.handleChange}
              />
            }
            onConfirm={this.handleConfirm}
            onCancel={this.handleCancel}
          />
        </div>
      </IssueRow>
    );
  }
}

class IssuesTable extends Component<IssuesTableProps> {
  unsubscribe: Function;

  componentDidMount() {
    this.unsubscribe = this.props.subscribeToJiraIssueUpdate();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { issues } = this.props;
    return (
      <Theme.Consumer>
        {tokens => (
          <Panel theme={tokens}>
            <h1>My latest issues</h1>
            <div className="body">
              {issues.map(issue => (
                <Issue
                  issue={issue}
                  key={issue.id}
                  updateSummary={this.props.updateSummary}
                />
              ))}
            </div>
          </Panel>
        )}
      </Theme.Consumer>
    );
  }
}

export default IssuesTable;
