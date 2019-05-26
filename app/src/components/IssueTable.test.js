import React from 'react';
import { shallow, wrapper } from 'enzyme';
import renderer from 'react-test-renderer';
import IssueTable, { Issue } from './IssueTable';

const issue = {
  summary: 'foo',
  id: 'bar',
  key: 'baz'
};
describe('<Issue />', () => {
  it('renders without crashing', () => {
    shallow(<Issue issue={issue} />);
  });
  it('matches the snapshot', () => {
    const tree = renderer.create(<Issue issue={issue} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe('handleChange', () => {
    it('updates the state', () => {
      const wrapper = shallow(<Issue issue={issue} />);
      wrapper.instance().handleChange({ target: { value: 'new value' } });
      expect(wrapper.instance().state.summary).toBe('new value');
    });
  });
  describe('handleConfirm', () => {
    it('updates the state', () => {
      const updateSummary = jest.fn();
      const wrapper = shallow(
        <Issue issue={issue} updateSummary={updateSummary} />
      );
      wrapper.instance().handleConfirm({ target: { value: 'new value' } });
      expect(updateSummary.mock.calls.length).toBe(1);
    });
  });
  describe('handleCancel', () => {
    it('updates the state', () => {
      const updateSummary = jest.fn();
      const wrapper = shallow(<Issue issue={issue} />);
      const instance = wrapper.instance();
      instance.handleChange({ target: { value: 'new value' } });
      instance.handleCancel();
      expect(wrapper.instance().state.summary).toBe(issue.summary);
    });
  });
});

describe('<IssueTable />', () => {
  it('renders without crashing', () => {
    shallow(<IssueTable subscribeToJiraIssueUpdate={() => ({})} />);
  });
  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <IssueTable subscribeToJiraIssueUpdate={() => ({})} issues={[]} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('subscribes/unsubscribes to jira issue updates', () => {
    const unsubscribe = jest.fn();
    const subscribe = jest.fn().mockReturnValue(unsubscribe);
    const component = shallow(
      <IssueTable subscribeToJiraIssueUpdate={subscribe} />
    );
    expect(subscribe.mock.calls.length).toBe(1);
    component.unmount();
    expect(unsubscribe.mock.calls.length).toBe(1);
  });
});
