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

  renderStats(stats) {
    console.log(stats);
    const visitorsToday = stats.today.length;
    const visitorsThirtyDays = stats.thirty_days.length;
    return (
      <div className="container">
        <div className="row stats">
          <div className="col-xs-6">
            <div className="today">
              <h1>Today</h1>
              <div>{visitorsToday} visits</div>
            </div>
          </div>
          <div className="col-xs-6">
            <div className="thirty-days">
              <h1>Last 30 days</h1>
              <p>{visitorsThirtyDays} visits</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { fetching, stats } = this.props;
    return (
      <div>
        {
          fetching ?
            <div>Loading stats</div>
          :
            this.renderStats(stats)
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
