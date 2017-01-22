import React from 'react';
import UserActions from '../../actions/user';

export default class TwitterKeys extends React.Component {
  constructor() {
    super();

    this.state = {
      consumerSecret: '',
      accessTokenSecret: '',
      accessToken: '',
      consumerKey: '',
    };
  }

  onInputChange(type, event) {
    this.setState({
      [type]: event.target.value,
    });
  }

  isValid() {
    return this.state.consumerKey.length > 0 &&
           this.state.consumerSecret.length > 0 &&
           this.state.accessToken.length > 0 &&
           this.state.accessTokenSecret.length > 0;
  }

  renderProgressbar() {
    const { isUpdating } = this.props;

    if (!isUpdating) {
      return null;
    }

    return (
      <div className="progress-indicator">Updating Twitter Credentials. Stand by...</div>
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

  onSubmitCredentials(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    const credentials = {
      consumer_secret: this.state.consumerSecret,
      access_token_secret: this.state.accessTokenSecret,
      access_token: this.state.accessToken,
      consumer_key: this.state.consumerKey,
    };
    dispatch(UserActions.postTwitterAccessToken(credentials));
  }

  render() {
    const { isUpdating } = this.props;
    const submitEnabled = (!isUpdating && this.isValid()) ? null : 'disabled';

    return (
      <form>
        {this.renderProgressbar()}
        {this.renderFormErrors()}
        <h1>Configure new Twitter access token</h1>
        <a target="_blank" href="https://apps.twitter.com"><p>Get yours here</p></a>
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
        <button onClick={this.onSubmitCredentials.bind(this)} disabled={submitEnabled} className="form-control btn btn-default">Save</button>
      </form>
    );
  }
}

TwitterKeys.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isUpdating: React.PropTypes.bool.isRequired,
  formErrors: React.PropTypes.array,
};
