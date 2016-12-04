import React from 'react';
import { connect } from 'react-redux';
import SessionActions           from '../../actions/sessions';
import { push }                 from 'react-router-redux';

class UserDetails extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (!phoenixAuthToken) {
      dispatch(push('/'));
    }
  }

  render() {
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
              <button className="form-control">Set password</button>
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