import React from 'react';

export default class TwitterKeys extends React.Component {
  constructor() {
    super();

    this.state = {
      consumerSecret: '',
      accessTokenSecret: '',
      accessToken: '',
      consumerKey: ''
    };
  }

  onInputChange(type, event) {
    this.setState({
      [type]: event.target.value
    });
  }

  isValid() {
    return this.state.consumerKey.length > 0 &&
           this.state.consumerSecret.length > 0 &&
           this.state.accessToken.length > 0 &&
           this.state.accessTokenSecret.length > 0;
  }

  render() {
    const submitEnabled = this.isValid() ? null : "disabled";
    return (
      <form>
        <h1>Configure Twitter access tokens</h1>
        <div className="form-group">
          <label htmlFor="accessToken">Access Token</label>
          <input onChange={this.onInputChange.bind(this, 'accessToken')} className="form-control" type="text" name="accessToken" />
        </div>
        <div className="form-group">
          <label htmlFor="accessTokenSecret">Access Token Secret</label>
          <input onChange={this.onInputChange.bind(this, 'accessTokenSecret')} className="form-control" type="text" name="accessTokenSecret" />
        </div>
        <div className="form-group">
          <label htmlFor="consumerSecret">Consumer Secret</label>
          <input onChange={this.onInputChange.bind(this, 'consumerSecret')} className="form-control" type="text" name="consumerSecret" />
        </div>
        <div className="form-group">
          <label htmlFor="consumerKey">Consumer Key</label>
          <input onChange={this.onInputChange.bind(this, 'consumerKey')} className="form-control" type="text" name="consumerKey" />
        </div>
        <button disabled={submitEnabled} className="form-control btn btn-default">Save</button>
      </form>
    );
  }
}