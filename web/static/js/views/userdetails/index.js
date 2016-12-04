import React from 'react';

export default class UserDetails extends React.Component {
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