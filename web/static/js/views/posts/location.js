import React from 'react';
import cx from 'classnames';

export default class PickLocation extends React.Component {

  onQueryLocationClick() {
    const { onLocationNameChange } = this.props;

    onLocationNameChange(this.refs.locationname.value);
  }

  renderSearchResults(locations) {
    const { onLocationSelected, selectedLocation } = this.props;

    return locations.map((location) => {
      const placeClassnames = cx({
        active: selectedLocation && location.places_id === selectedLocation,
        location: true,
      });
      return (
        <li className={placeClassnames} key={location.places_id} onClick={() => onLocationSelected(location.places_id)}>
          <h3>{location.main_text}</h3>
          <p>
            {location.description}
          </p>
        </li>
      );
    });
  }

  render() {
    const { locations } = this.props;

    return (
      <div className="location-form">
        <div className="location-input">
          <input ref="locationname" type="text" name="location" />
        </div>
        <div>
          <button onClick={this.onQueryLocationClick.bind(this)} className="btn search-button">Search</button>
        </div>
        <ul>
          {this.renderSearchResults(locations)}
        </ul>
      </div>
    );
  }
}
