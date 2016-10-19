import React        from 'react';
import { connect }  from 'react-redux';
import { push } from 'react-router-redux';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import Actions from '../actions/sessions';

class ShellContainer extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (phoenixAuthToken && !currentUser) {
      dispatch(Actions.currentUser());
    }
  }

  onCreateNewPost() {
    const { dispatch } = this.props;

    dispatch(push("/posts/new"));
  }

  onShowStats() {
    const { dispatch } = this.props;

    dispatch(push("/stats"));
  }

  render() {
    const { currentUser, dispatch, currentPath } = this.props;

    return (
      <div>
        <div className="application-container">
          <Header
            currentUser={currentUser}
            dispatch={dispatch}/>

          <div className="main-container">
            {this.props.children}
          </div>
        </div>
        {currentPath == '/posts/new' ?
          null :
          <Footer currentUser={currentUser}
                showStatsClick={this.onShowStats.bind(this)}
                newPostClick={this.onCreateNewPost.bind(this)} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentPath: state.routing.locationBeforeTransitions.pathname,
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(ShellContainer);
