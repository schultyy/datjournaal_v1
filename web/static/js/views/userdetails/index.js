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
    const { dispatch, isUpdating, formErrors } = this.props;

    return (
      <div className="userdetails">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <ResetPassword isUpdating={isUpdating} formErrors={formErrors} dispatch={dispatch} />
          </div>
          <div className="col-xs-12 col-md-6">
            <TwitterKeys />
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