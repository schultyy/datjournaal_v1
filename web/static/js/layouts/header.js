import React          from 'react';
import { Link }       from 'react-router';
import SessionActions from '../actions/sessions';
import PostActions    from '../actions/posts';

export default class Header extends React.Component {
  renderCurrentUser() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return false;
    }

    return (
      <span>{currentUser.handle}</span>
    );
  }

  render() {
    return (
      <header className="main-header">
        <nav className="right">
          <ul className="list-inline">
            <li>
              <div className="menu-entry">
                <Link to='/'>
                  <div title="Plattdeutsch für: die Zeitung" className="logo">
                    dat Journaal
                  </div>
                </Link>
              </div>
            </li>
            <li>
              <div className="menu-entry">
                <Link to="/imprint">
                  Imprint
                </Link>
              </div>
            </li>
            <li>
              <div className="menu-entry">{this.renderCurrentUser()}</div>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
