import React          from 'react';
import { connect }    from 'react-redux';
import { push }       from 'react-router-redux';
import ResetPassword  from './resetPassword';
import TwitterKeys    from './twitterKeys';

class UserDetails extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (!phoenixAuthToken) {
      dispatch(push('/'));
    }
  }

  render() {
    const {
      dispatch,
      isPasswordUpdating,
      isTwitterUpdating,
      passwordFormErrors,
      twitterFormErrors
    } = this.props;

    return (
      <div className="userdetails">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <ResetPassword isUpdating={isPasswordUpdating} formErrors={passwordFormErrors} dispatch={dispatch} />
          </div>
          <div className="col-xs-12 col-md-6">
            <TwitterKeys isUpdating={isTwitterUpdating} formErrors={twitterFormErrors} dispatch={dispatch} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  passwordFormErrors: state.userPassword.formErrors,
  isPasswordUpdating: state.userPassword.updating,
  twitterFormErrors: state.twitter.formErrors,
  isTwitterUpdating: state.twitter.updating,
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(UserDetails);