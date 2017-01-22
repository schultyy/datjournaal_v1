import React from 'react';
import cx from 'classnames';
import UserActions from '../../actions/user';

export default class ResetPassword extends React.Component {
  constructor() {
    super();

    this.onOldPasswordChange = this.onOldPasswordChange.bind(this);
    this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);

    this.state = {
      oldPassword: '',
      newPassword: '',
    };
  }

  onOldPasswordChange(event) {
    this.setState({
      oldPassword: event.target.value,
    });
  }

  onNewPasswordChange(event) {
    this.setState({
      newPassword: event.target.value,
    });
  }

  onSubmitPassword(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;

    dispatch(UserActions.updatePassword(oldPassword, newPassword));
  }

  renderProgressbar() {
    const { isUpdating } = this.props;

    if (!isUpdating) {
      return null;
    }

    return (
      <div className="progress-indicator">Updating Password. Stand by...</div>
    );
  }

  renderFormErrors() {
    const { formErrors } = this.props;
    if (!formErrors) {
      return null;
    }

    const errors = formErrors.map(error => Object.keys(error).map(key => Object.create({
      field: key,
      message: error[key],
    }))[0]);

    return (
      <div className="error-message">
        <ul>
          {errors.map((err, index) => (<li key={index}>{err.field}: {err.message}</li>))}
        </ul>
      </div>
    );
  }

  render() {
    const submitButtonClassnames = cx({
      'form-control': true,
      btn: true,
      'btn-default': true,
    });

    const { isUpdating } = this.props;
    const buttonDisabled = (this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && !isUpdating) ? null : 'disabled';

    return (
      <form>
        <h1>Change password</h1>
        {this.renderProgressbar()}
        {this.renderFormErrors()}
        <div className="form-group">
          <label htmlFor="currentPassword">Current password</label>
          <input
            onChange={this.onOldPasswordChange}
            className="form-control"
            type="password"
            name="currentPassword"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New password</label>
          <input
            onChange={this.onNewPasswordChange}
            className="form-control"
            type="password"
            name="newPassword"
          />
        </div>
        <button
          onClick={this.onSubmitPassword}
          className={submitButtonClassnames}
          disabled={buttonDisabled}
        >
          Set password
        </button>
      </form>
    );
  }
}

ResetPassword.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isUpdating: React.PropTypes.bool.isRequired,
  formErrors: React.PropTypes.array.isRequired
};
