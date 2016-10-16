import React            from 'react';
import { connect }      from 'react-redux';
import SessionActions   from '../../actions/sessions';
import { push }         from 'react-router-redux';

class StatsView extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');

    if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
    } else {
      dispatch(push('/'));
    }
  }
  render() {
    return (
      <div>
        Stats are here
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(StatsView);
