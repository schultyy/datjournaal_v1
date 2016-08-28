import React        from 'react';
import { connect }  from 'react-redux';
import { push } from 'react-router-redux';
import Header from '../layouts/header';
import Actions from '../actions/sessions';

class ShellContainer extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (phoenixAuthToken && !currentUser) {
      dispatch(Actions.currentUser());
    }
  }

  render() {
    const { currentUser, dispatch } = this.props;
    return (
      <div className="application-container">
        <Header
          currentUser={currentUser}
          dispatch={dispatch}/>

        <div className="main-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(ShellContainer);
