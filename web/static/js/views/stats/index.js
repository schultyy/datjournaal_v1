import React            from 'react';
import { connect }      from 'react-redux';
import SessionActions   from '../../actions/sessions';
import StatsActions     from '../../actions/stats';
import { push }         from 'react-router-redux';

class StatsView extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const phoenixAuthToken = localStorage.getItem('phoenixAuthToken');
    if (phoenixAuthToken && !currentUser) {
      dispatch(SessionActions.currentUser());
      dispatch(StatsActions.fetchStats());
    }
    else {
      dispatch(push('/'));
    }
  }
  renderStats() {
    const { stats } = this.props;
    console.log(stats);
    function isToday(otherDate) {
      var today = new Date();
      return otherDate.getDate() == today.getDate() &&
        otherDate.getMonth() == today.getMonth() && otherDate.getFullYear() == today.getFullYear();
    }
    // const todaysVisits = stats.map(stat => {
    //   if(isToday(Date.parse(stat.inserted_at))) {
    //     return stat;
    //   }
    //   return null;
    // });
    // console.log(todaysVisits);
    return (
      <div>
        <h1>Datjournaal's activity</h1>
      </div>
    );
  }
  render() {
    const { fetching } = this.props;
    const renderStats = this.renderStats.bind(this);
    return (
      <div>
        {
          fetching ?
            <div>Loading stats</div>
          :
            renderStats()
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.stats.fetching,
    ...state.stats
  };
};

export default connect(mapStateToProps)(StatsView);
