import React from 'react';

export default class TwitterKeys extends React.Component {
  onLoginWithTwitterClick(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="twitter-account">
        <form>
          <h1>Configure your Twitter account</h1>
          <div>
            <button onClick={this.onLoginWithTwitterClick.bind(this)}>Log in with Twitter</button>
          </div>
        </form>
      </div>
    );
  }
}

TwitterKeys.propTypes = {
  dispatch: React.PropTypes.func.isRequired
};
