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
        <div className="col-xs-8 col-md-8">
          <input ref="locationname" className="location-input form-control" type="text" name="location" />
        </div>
        <div className="col-xs-4 col-md-2">
          <button onClick={this.onQueryLocationClick.bind(this)} className="btn btn-default search-button">Search</button>
        </div>
        <div className="clearfix" />
        <div className="col-xs-12">
          <ul>
            {this.renderSearchResults(locations)}
          </ul>
        </div>
      </div>
    );
  }
}
