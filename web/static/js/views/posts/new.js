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

    if (phoenixAuthToken && !currentUser) {
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
      image: this.refs.file.files[0]
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
    let { formErrors } = this.props;

    const canPost = this.state.posting ? "disabled" : null;

    const previewImage = this.state.previewImage;

    const imagePreviewClasses = cx({
      'col-xs-4': true,
      'col-md-4': true,
      'image-preview': true
    });

    return (
      <div className="container new-post-form">
        <h3>Create a new post</h3>
        {formErrors ? this.renderFormErrors(formErrors) : null}
        <form>
          <div className="row">
            <div className={imagePreviewClasses}>
              <img src={previewImage} className="thumbnail" />
            </div>
            <div className="col-xs-8 col-md-8 form-group">
              <label htmlFor="post-description">Description</label>
              <textarea ref="description" className="post-description" rows="3" className="form-control">
              </textarea>
            </div>
            <div className="form-group col-xs-12">
              <label htmlFor="post-file">Pick a file</label>
              <input type="file" ref="file" accept="image/*" onChange={this.onPreviewChange.bind(this)} className="form-control" />
            </div>
            <div className="col-xs-12">
              <button disabled={canPost} onClick={this.createNewPost}>Create Post</button>
              {canPost ? this.renderLoadingIndicator() : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formErrors: state.posts.formErrors
  };
};

export default connect(mapStateToProps)(NewPostComponent);
