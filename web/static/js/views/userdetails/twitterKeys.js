import React from 'react';

export default class TwitterKeys extends React.Component {
  render() {
    return (
      <form>
        <h1>Configure Twitter access tokens</h1>
        <div className="form-group">
          <label htmlFor="accessToken">Access Token</label>
          <input className="form-control" type="text" name="accessToken" />
        </div>
        <div className="form-group">
          <label htmlFor="accessTokenSecret">Access Token Secret</label>
          <input className="form-control" type="text" name="accessTokenSecret" />
        </div>
        <div className="form-group">
          <label htmlFor="consumerSecret">Consumer Secret</label>
          <input className="form-control" type="text" name="consumerSecret" />
        </div>
        <div className="form-group">
          <label htmlFor="consumerKey">Consumer Key</label>
          <input className="form-control" type="text" name="consumerKey" />
        </div>
        <button className="form-control btn btn-default">Save</button>
      </form>
    );
  }
}