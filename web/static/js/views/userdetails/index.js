import React          from 'react';
import { connect }    from 'react-redux';
import { push }       from 'react-router-redux';
import cx             from 'classnames';
import SessionActions from '../../actions/sessions';
import UserActions    from '../../actions/user';

class UserDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      oldPassword: '',
      newPassword: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (!phoenixAuthToken) {
      dispatch(push('/'));
    }
  }

  onOldPasswordChange(event) {
    this.setState({
      oldPassword: event.target.value
    });
  }

  onNewPasswordChange(event) {
    this.setState({
      newPassword: event.target.value
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

    if(!isUpdating) {
      return null;
    }

    return (
      <div>
        <p>Updating Password. Stand by...</p>
      </div>
    );
  }

  renderFormErrors() {
    const { formErrors } = this.props;
    if(!formErrors) {
      return null;
    }

    return (
      <div>
        <p>Oops. Something went wrong!</p>
      </div>
    );
  }

  render() {
    const submitButtonClassnames = cx({
      'form-control': true,
      'btn': true,
      'btn-default': true
    });

    const buttonDisabled = (this.state.oldPassword.length > 0 && this.state.newPassword.length > 0) ? null : 'disabled';

    return (
      <div className="userdetails">
        <div className="row">
          <div className="col-xs-12">
            <h1>Change password</h1>
            {this.renderProgressbar()}
            {this.renderFormErrors()}
            <form>
              <div className="form-group">
                <label htmlFor="currentPassword">Current password</label>
                <input onChange={this.onOldPasswordChange.bind(this)} className="form-control" type="password" name="currentPassword" />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New password</label>
                <input onChange={this.onNewPasswordChange.bind(this)} className="form-control" type="password" name="newPassword" />
              </div>
              <button onClick={this.onSubmitPassword.bind(this)} className={submitButtonClassnames} disabled={buttonDisabled}>Set password</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  formErrors: state.user.formErrors,
  isUpdating: state.user.updating,
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(UserDetails);