import React, {PropTypes}   from 'react';
import { connect }          from 'react-redux';
import { Link }             from 'react-router';

import { setDocumentTitle } from '../../utils';
import Actions              from '../../actions/sessions';

class SessionsNew extends React.Component {
  componentDidMount() {
    setDocumentTitle('Sign in');
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.refs;
    const { dispatch } = this.props;

    dispatch(Actions.signIn(email.value, password.value));
  }

  renderError() {
    const { errors } = this.props;
    if (!errors) return false;

    return (
      <div className="error">
        {errors}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <main className="col-xs-12 col-md-offset-4 col-md-4 container login">
            <header>
              <div className="logo">dat Journaal</div>
              <h3>Login</h3>
            </header>
            <form onSubmit={::this.handleSubmit}>
              {::this.renderError()}
              <div className="field">
                <input ref="email" type="Email" placeholder="Email" required="true" />
              </div>
              <div className="field">
                <input ref="password" type="password" placeholder="Password" required="true" />
              </div>
              <button type="submit" className="btn btn-info">Sign in</button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.session.currentUser,
    errors: state.session.errors
  };
};

export default connect(mapStateToProps)(SessionsNew);
