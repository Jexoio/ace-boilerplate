import React from 'react';
import { shallow, wrapper } from 'enzyme';
import renderer from 'react-test-renderer';
import UserInfo from './UserInfo';

const me = {
  id: 'foo',
  userAccountId: 'bar',
  clientKey: 'baz',
  clientKey: 'boo'
};
it('renders without crashing', () => {
  shallow(<UserInfo me={me} />);
});
it('matches the snapshot', () => {
  const tree = renderer.create(<UserInfo me={me} />).toJSON();
  expect(tree).toMatchSnapshot();
});
