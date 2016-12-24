import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import { push }                 from 'react-router-redux';
import cx                       from 'classnames';
import PostActions              from '../../actions/posts';
import SessionActions           from '../../actions/sessions';
import Location                 from './location';


class NewPostComponent extends React.Component {
  constructor(props) {
    super(props);
    this.createNewPost = this.createNewPost.bind(this);

    this.state = {
      posting: false,
      previewImage: null,
      renderLocation: false
    };
  }
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');
    if(phoenixAuthToken && currentUser) {
      return;
    }
    else if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    } else {
      dispatch(push('/'));
    }
  }

  createNewPost(event) {
    event.preventDefault();
    const { dispatch } = this.props;

    let formData = {
      description: this.refs.description.value,
      postOnTwitter: this.refs.twitter.checked,
      image: this.refs.file.files[0],
      includeLocation: this.refs.geolocation.checked
    };

    this.setState({posting: true});
    dispatch(PostActions.createPost(formData));
  }

  renderFormErrors(formErrors) {
    return (
      <div className="alert alert-danger" role="alert">
        <ul>
          {formErrors.map(error => {
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
    if(newProps.formErrors) {
      this.setState({
        posting: false
      });
    }
  }

  onPreviewChange() {
    const inputControl = this.refs.file;
    const that = this;
    if(inputControl.files && inputControl.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function (e) {
          that.setState({
            previewImage: e.target.result
          });
        }
        reader.readAsDataURL(inputControl.files[0]);
    }
  }

  onQueryLocationChange() {
    this.setState({renderLocation: !this.state.renderLocation});
  }

  onLocationNameChange(newLocationName) {
    const { dispatch } = this.props;
    dispatch(PostActions.queryLocationName(newLocationName));
  }

  onLocationSelected(placesId) {
    console.log(placesId);
  }

  render() {
    let { formErrors, currentUser, locationResults } = this.props;
    const canPost = this.state.posting ? "disabled" : null;
    const previewImage = this.state.previewImage;
    const twitterDisabled = (currentUser && currentUser.twitter_configured) ? null : "disabled";
    const imagePreviewClasses = cx({
      'col-xs-12': true,
      'col-md-12': true,
      'image-preview': true
    });

    return (
      <div className="new-post-form">
        <h3 className="headline">New post</h3>
        {formErrors ? this.renderFormErrors(formErrors) : null}

        <div className="row">
          <div className={imagePreviewClasses}>
            <img src={previewImage} />
          </div>
          <div className="form-group col-xs-12 col-md-12 file-upload">
            <label htmlFor="post-file">Select the file you would like to share</label>
            <input type="file" ref="file" accept="image/*" onChange={this.onPreviewChange.bind(this)} />
          </div>
          <div className="col-xs-12 col-md-12 form-group description-container">
            <label htmlFor="post-description">Describe it</label>
            <textarea ref="description" rows="5" className="post-description form-control" placeholder="Write a caption...">
            </textarea>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <p className="sheet">
              Add current location
            </p>
          </div>

          <div className="col-xs-12 col-md-6">
            <div className="sheet">
              <input onChange={this.onQueryLocationChange.bind(this)} name="request-geolocation" type="checkbox" ref="geolocation" />
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="col-xs-12 col-md-6">
            <p className="sheet">
              Publish on Twitter
            </p>
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="sheet">
              <input  disabled={twitterDisabled} name="publish" type="checkbox" ref="twitter" />
            </div>
          </div>
        </div>
        <div className="row">
          {this.state.renderLocation ?
            <Location onLocationSelected={this.onLocationSelected.bind(this)} locations={locationResults} onLocationNameChange={this.onLocationNameChange.bind(this)} />
            : null}
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <button className="submit-post btn btn-success" disabled={canPost} onClick={this.createNewPost}>Create Post</button>
            {canPost ? this.renderLoadingIndicator() : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formErrors: state.posts.formErrors,
    currentUser: state.session.currentUser,
    locationsLoading: state.location.loading,
    locationResults: state.location.locations
  };
};

export default connect(mapStateToProps)(NewPostComponent);
