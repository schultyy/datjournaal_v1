import React          from 'react';
import { connect }    from 'react-redux';
import { push }       from 'react-router-redux';
import cx             from 'classnames';
import SessionActions from '../../actions/sessions';

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
            <form>
              <div className="form-group">
                <label htmlFor="currentPassword">Current password</label>
                <input className="form-control" type="text" name="currentPassword" />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New password</label>
                <input className="form-control" type="text" name="newPassword" />
              </div>
              <button className={submitButtonClassnames} disabled={buttonDisabled}>Set password</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(UserDetails);