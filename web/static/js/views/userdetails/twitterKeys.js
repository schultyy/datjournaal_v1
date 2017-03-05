import React from 'react';

export default class TwitterKeys extends React.Component {
  onInputChange(type, event) {
    this.setState({
      [type]: event.target.value,
    });
  }

  render() {
    return null;
  }
}

TwitterKeys.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isUpdating: React.PropTypes.bool.isRequired,
};
