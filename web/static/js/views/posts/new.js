import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import PostActions              from '../../actions/posts';
import SessionActions           from '../../actions/sessions';
import { push }                 from 'react-router-redux';
import cx                       from 'classnames';


class NewPostComponent extends React.Component {
  constructor(props) {
    super(props);
    this.createNewPost = this.createNewPost.bind(this);

    this.state = {
      posting: false,
      previewImage: null
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

  render() {
    let { formErrors, currentUser } = this.props;

    const canPost = this.state.posting ? "disabled" : null;

    const previewImage = this.state.previewImage;

    const imagePreviewClasses = cx({
      'collapse': !previewImage,
      'col-xs-12': true,
      'col-md-12': true,
      'image-preview': true
    });

    const descriptionFieldClasses = cx({
      'col-xs-12': true,
      'col-md-12': true,
      'form-group': true,
      'description-container': true
    });

    const twitterDisabled = (currentUser && currentUser.twitter_configured) ? null : "disabled";

    return (
      <div className="new-post-form">
        <h3 className="headline">New post</h3>
        {formErrors ? this.renderFormErrors(formErrors) : null}

        <div className="row">
          <form>
            <div className={imagePreviewClasses}>
              <img src={previewImage} className="img-thumbnail" />
            </div>
            <div className="form-group col-xs-12 col-md-12 file-upload">
              <label htmlFor="post-file">Select the file you would like to share</label>
              <input type="file" ref="file" accept="image/*" onChange={this.onPreviewChange.bind(this)} />
            </div>
            <div className={descriptionFieldClasses}>
              <label htmlFor="post-description">Describe it</label>
              <textarea ref="description" rows="5" className="post-description form-control" placeholder="Write a caption...">
              </textarea>
            </div>
            <div className="form-group col-xs-12 col-md-6 location">
              <label htmlFor="request-geolocation">Add current location
                <input name="request-geolocation" type="checkbox" ref="geolocation" />
              </label>
            </div>
            <div className="form-group col-xs-12 col-md-6 publish-on-twitter">
              <label htmlFor="publish">Publish on Twitter
                <input disabled={twitterDisabled} name="publish" type="checkbox" ref="twitter" />
              </label>
            </div>
            <div className="col-xs-12 col-md-12">
              <button className="submit-post btn btn-success" disabled={canPost} onClick={this.createNewPost}>Create Post</button>
              {canPost ? this.renderLoadingIndicator() : null}
            </div>
            </form>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formErrors: state.posts.formErrors,
    currentUser: state.session.currentUser
  };
};

export default connect(mapStateToProps)(NewPostComponent);
