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
      <span><Link to="/userdetails">{currentUser.handle}</Link></span>
    );
  }

  render() {
    return (
      <header className="main-header">
        <nav>
          <ul className="list-inline">
            <li className="menu-entry">
              <div>
                <Link to='/'>
                  <div title="Plattdeutsch für: die Zeitung" className="logo">
                    <span className="image"></span>
                    <span className="text">dat Journaal</span>
                  </div>
                </Link>
              </div>
            </li>
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
