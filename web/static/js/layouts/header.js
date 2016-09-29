import React          from 'react';
import { Link }       from 'react-router';
import SessionActions from '../actions/sessions';
import PostActions    from '../actions/posts';

export default class Header extends React.Component {
  _renderCurrentUser() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return false;
    }

    return (
        <span>{currentUser.handle}</span>
    );
  }

  _renderSignOutLink() {
    if (!this.props.currentUser) {
      return false;
    }

    return (
      <a href="#" onClick={::this._handleSignOutClick}>Sign out</a>
    );
  }

  _handleSignOutClick(e) {
    e.preventDefault();

    this.props.dispatch(SessionActions.signOut());
  }

  render() {
    return (
      <header className="main-header">
        <nav className="right">
          <ul className="list-inline">
            <li>
              <div className="menu-entry">
                <Link to='/'>
                  dat Journaal
                </Link>
              </div>
            </li>
            <li>
              <div className="menu-entry">{this._renderCurrentUser()}</div>
            </li>
            <li>
              <div className="menu-entry">{this._renderSignOutLink()}</div>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
