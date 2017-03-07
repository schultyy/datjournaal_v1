import React, {PropTypes}   from 'react';
import { connect }          from 'react-redux';
import { Link }             from 'react-router';
import cx                   from 'classnames';
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
    const { signingIn } = this.props;

    const buttonClasses = cx({
      "btn": true,
      "disabled": signingIn
    });

    return (
      <div>
        <div>
          <main className="login">
            <header>
              <div className="logo"><span className="text">dat Journaal</span></div>
              <h4>Login</h4>
            </header>
            <form onSubmit={::this.handleSubmit}>
              {::this.renderError()}
              <div className="field">
                <input ref="email" type="Email" placeholder="Email" required="true" />
              </div>
              <div className="field">
                <input ref="password" type="password" placeholder="Password" required="true" />
              </div>
              <button type="submit" className={buttonClasses}>Sign in</button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signingIn: state.session.signingIn,
    currentUser: state.session.currentUser,
    errors: state.session.errors
  };
};

export default connect(mapStateToProps)(SessionsNew);
