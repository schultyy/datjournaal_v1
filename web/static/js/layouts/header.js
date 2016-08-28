import React          from 'react';
import { Link }       from 'react-router';
import Actions        from '../actions/sessions';
// import ReactGravatar  from 'react-gravatar';

export default class Header extends React.Component {
  constructor() {
    super();
  }

  _renderCurrentUser() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return false;
    }

    return (
        <span>{currentUser.handle}</span>
    );
  }

  _renderCreateNewImageLink() {
    if(!this.props.currentUser) {
      return false;
    }

    return (<Link to="/new_post">New post</Link>);
  }

  _renderSignOutLink() {
    if (!this.props.currentUser) {
      return false;
    }

    return (
      <a href="#" onClick={::this._handleSignOutClick}><i className="fa fa-sign-out"/> Sign out</a>
    );
  }

  _handleSignOutClick(e) {
    e.preventDefault();

    this.props.dispatch(Actions.signOut());
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
              <div className="menu-entry">
                {this._renderCreateNewImageLink()}
              </div>
            </li>
            <li>
              <div className="menu-entry">User: {this._renderCurrentUser()}</div>
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
