import React from 'react';

export default class PickLocation extends React.Component {
  renderSearchResults() {
    return null;
  }

  render() {
    return (
      <div>
        <div className="col-xs-12">
          <input type="text" name="location" />
        </div>
        <div className="col-xs-12">
          <ul>
            {this.renderSearchResults()}
          </ul>
        </div>
      </div>
    );
  }
}