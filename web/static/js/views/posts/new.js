import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import cx from 'classnames';
import PostActions from '../../actions/posts';
import SessionActions from '../../actions/sessions';
import Location from './location';


class NewPostComponent extends React.Component {
  constructor(props) {
    super(props);
    this.createNewPost = this.createNewPost.bind(this);

    this.state = {
      posting: false,
      previewImage: null,
      useCustomLocation: false,
      useCurrentLocation: false,
      currentLocationId: null,
    };
  }
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');
    if (phoenixAuthToken && currentUser) {
      dispatch(PostActions.clearLocationSuggestions());
    } else if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    } else {
      dispatch(push('/'));
    }
  }

  createNewPost(event) {
    event.preventDefault();
    const { dispatch } = this.props;

    const formData = {
      description: this.refs.description.value,
      postOnTwitter: this.refs.twitter.checked,
      image: this.refs.file.files[0],
      includeLocation: this.refs.geolocation.checked,
    };

    if (this.refs.custom_geolocation.checked && this.state.currentLocationId) {
      Object.assign(formData, { places_id: this.state.currentLocationId });
    }

    this.setState({ posting: true });
    dispatch(PostActions.createPost(formData));
  }

  renderFormErrors(formErrors) {
    return (
      <div className="alert" role="alert">
        <ul>
          {formErrors.map((error) => {
            const propertyName = Object.keys(error)[0];
            return (
              <li key={propertyName}>{propertyName} - {error[propertyName]}</li>
            );
          })}
        </ul>
      </div>
    );
  }

  renderLoadingIndicator() {
    return (
      <div className="loading-indicator">
        Posting...
      </div>
    );
  }

  componentWillReceiveProps(newProps) {
    if (newProps.formErrors) {
      this.setState({
        posting: false,
      });
    }
  }

  onPreviewChange() {
    const inputControl = this.refs.file;
    const that = this;
    if (inputControl.files && inputControl.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        that.setState({
          previewImage: e.target.result,
        });
      };
      reader.readAsDataURL(inputControl.files[0]);
    }
  }

  onQueryLocationChange() {
    if (this.state.useCustomLocation === true) {
      this.setState({ useCustomLocation: false, useCurrentLocation: false });
    } else {
      this.setState({ useCustomLocation: true, useCurrentLocation: false });
    }
  }

  onLocationNameChange(newLocationName) {
    const { dispatch } = this.props;
    dispatch(PostActions.queryLocationName(newLocationName));
  }

  onLocationSelected(placesId) {
    this.setState({ currentLocationId: placesId });
  }

  onUseCurrentLocationChange(event) {
    const useCurrentLocation = this.state.useCurrentLocation;
    if (useCurrentLocation) {
      this.setState({ useCustomLocation: false, useCurrentLocation: false });
    } else {
      this.setState({ useCustomLocation: false, useCurrentLocation: true });
    }
  }

  render() {
    const { formErrors, currentUser, locationResults } = this.props;
    const canPost = this.state.posting ? 'disabled' : null;
    const previewImage = this.state.previewImage;
    const twitterDisabled = (currentUser && currentUser.twitter_configured) ? null : 'disabled';

    return (
      <div className="new-post-form">
        {formErrors ? this.renderFormErrors(formErrors) : null}

        <div className="image-and-text">
          <div className="image-preview">
            <img src={previewImage} />
          </div>
          <div className="file-upload">
            <input type="file" ref="file" accept="image/*" onChange={this.onPreviewChange.bind(this)} />
          </div>
          <div className="description-container">
            <textarea ref="description" rows="5" className="post-description" placeholder="Write a caption..." />
          </div>
        </div>
        <div className="sheets">
          <div className="sheet">
            <p>Add custom location</p>
            <input onChange={this.onQueryLocationChange.bind(this)} checked={this.state.useCustomLocation} name="custom-geolocation" type="checkbox" ref="custom_geolocation" />
          </div>

          <div className="sheet">
            <p>Publish on Twitter</p>
            <input disabled={twitterDisabled} name="publish" type="checkbox" ref="twitter" />
          </div>

          <div className="sheet">
            <p>Use my current location</p>
            <input onChange={this.onUseCurrentLocationChange.bind(this)} checked={this.state.useCurrentLocation} name="request-geolocation" type="checkbox" ref="geolocation" />
          </div>
        </div>

        <div>
          {this.state.useCustomLocation ?
            <Location
              locations={locationResults}
              selectedLocation={this.state.currentLocationId}
              onLocationSelected={this.onLocationSelected.bind(this)}
              onLocationNameChange={this.onLocationNameChange.bind(this)}
            />
            : null}
        </div>
        <div>
          <button className="submit-post" disabled={canPost} onClick={this.createNewPost}>Create Post</button>
          { canPost ? this.renderLoadingIndicator() : null }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formErrors: state.posts.formErrors,
  currentUser: state.session.currentUser,
  locationsLoading: state.location.loading,
  locationResults: state.location.locations,
});

export default connect(mapStateToProps)(NewPostComponent);
