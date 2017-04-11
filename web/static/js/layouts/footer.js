import React from 'react';
import SessionActions from '../actions/sessions';

export default class Footer extends React.Component {
  constructor() {
    super();
    this.handleSignOutClick = this.handleSignOutClick.bind(this);
  }

  handleSignOutClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;

    dispatch(SessionActions.signOut());
  }

  renderSignOutLink() {
    if (!this.props.currentUser) {
      return false;
    }

    return (
      <li><button onClick={this.handleSignOutClick}>🏃</button></li>
    );
  }

  render() {
    const { newPostClick, showStatsClick, currentUser } = this.props;

    if (!currentUser) {
      return false;
    }

    return (
      <div className="footer">
        <ul className="list-inline">
          <li><button className="new-post" onClick={newPostClick}>+</button></li>
          <li><button onClick={showStatsClick}>📈</button></li>
          {this.renderSignOutLink()}
        </ul>
      </div>
    );
  }
}

Footer.propTypes = {
  currentUser: React.PropTypes.object,
  newPostClick: React.PropTypes.func.isRequired,
  showStatsClick: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};
