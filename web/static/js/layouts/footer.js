import React from 'react';
import SessionActions from '../actions/sessions';

export default class Footer extends React.Component {
  renderSignOutLink() {
    if (!this.props.currentUser) {
      return false;
    }

    return (
      <li><button className="sign-out" onClick={::this.handleSignOutClick}>Sign out</button></li>
    );
  }

  handleSignOutClick(e) {
    e.preventDefault();

    this.props.dispatch(SessionActions.signOut());
  }

  render() {
    const { newPostClick, showStatsClick, currentUser } = this.props;

    if(!currentUser) {
      return false;
    }

    return (
      <div className="footer">
        <ul className="list-inline">
          <li><button onClick={newPostClick}>+</button></li>
          <li><button className="show-stats" onClick={showStatsClick}>Stats</button></li>
          {this.renderSignOutLink()}
        </ul>
      </div>
    );
  }
}
