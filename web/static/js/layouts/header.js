import React from 'react';
import { Link } from 'react-router';
import SessionActions from '../actions/sessions';
import PostActions from '../actions/posts';

export default class Header extends React.Component {
  renderCurrentUser() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return false;
    }

    return (
      <span><Link to="/userdetails">{currentUser.handle}</Link></span>
    );
  }

  render() {
    return (
      <header className="main-header">
        <Link className="logo" to="/" title="Plattdeutsch für: die Zeitung">
          dat Journaal
        </Link>
        <nav className="menu">
          <ul className="list-inline">
            <li className="menu-entry">
              <div>
                <Link to="/about">
                  About
                </Link>
              </div>
            </li>
            <li className="menu-entry">
              <div>{this.renderCurrentUser()}</div>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
