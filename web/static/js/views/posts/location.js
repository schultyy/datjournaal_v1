import React from 'react';

export default class PickLocation extends React.Component {
  renderSearchResults(locations) {
    return locations.map((location) => {
      return (
        <li key={location.places_id}>
          <h3>{location.main_text}</h3>
          <p>
            {location.description}
          </p>
        </li>
      );
    });
  }

  onQueryLocationClick() {
    const { onLocationNameChange } = this.props;

    onLocationNameChange(this.refs.locationname.value);
  }

  render() {
    const { locations } = this.props;

    return (
      <div className="location-form">
        <div className="col-xs-11">
          <input ref="locationname" className="location-input" type="text" name="location" />
        </div>
        <div className="col-xs-1">
          <button onClick={this.onQueryLocationClick.bind(this)} className="btn btn-default">Search</button>
        </div>
        <div className="col-xs-12">
          <ul>
            {this.renderSearchResults(locations)}
          </ul>
        </div>
      </div>
    );
  }
}