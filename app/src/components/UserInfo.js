// @flow
import React, { Component } from 'react';
import Theme from '../providers/Theme';
import styled from 'styled-components';

const UserInfoDiv = styled.div`
  margin: 10px 0;
`;

type UserInfoProps = {
  me: {
    id: string,
    userAccountId: string,
    clientKey: string,
    updatedAt: string
  }
};
class UserInfo extends Component<UserInfoProps> {
  render() {
    const { me } = this.props;
    return (
      <Theme.Consumer>
        {tokens => (
          <UserInfoDiv>
            <h2 style={{ color: tokens.h1.textColor }}>User info</h2>
            <table>
              <tbody>
                <tr>
                  <td>id</td>
                  <td>{me.id}</td>
                </tr>
                <tr>
                  <td>userAccountId</td>
                  <td>{me.userAccountId}</td>
                </tr>
                <tr>
                  <td>clientKey</td>
                  <td>{me.clientKey}</td>
                </tr>
                <tr>
                  <td>updatedAt</td>
                  <td>{me.updatedAt}</td>
                </tr>
              </tbody>
            </table>
          </UserInfoDiv>
        )}
      </Theme.Consumer>
    );
  }
}

export default UserInfo;
