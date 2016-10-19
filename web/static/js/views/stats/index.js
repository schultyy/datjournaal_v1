import React            from 'react';
import { connect }      from 'react-redux';
import SessionActions   from '../../actions/sessions';
import StatsActions     from '../../actions/stats';
import { push }         from 'react-router-redux';
import fp               from 'lodash/fp';

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

  uniqueStats(stats) {
    return fp.uniqBy((stat) => stat.ip)(stats);
  }

  renderStats(headline, visitorsToday, visitorsThirtyDays) {
    return (
      <div className="row stats">
        <div className="col-xs-12">
          <h1>{headline}</h1>
        </div>
        <div className="col-xs-6">
          <div className="today">
            <h3>Today</h3>
            <div className="visitor-count">{visitorsToday} visits</div>
          </div>
        </div>
        <div className="col-xs-6">
          <div className="thirty-days">
            <h3>Last 30 days</h3>
            <div className="visitor-count">{visitorsThirtyDays} visits</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { fetching, stats } = this.props;
    if(fetching) {
      return (
        <div className="container">
          <div>Loading stats</div>
        </div>
      );
    }

    const uniqueVisitorsToday = this.uniqueStats(stats.today).length;
    const uniqueVisitorsThirtyDays = this.uniqueStats(stats.thirty_days).length;

    const overallVisitorsToday = stats.today.length;
    const overallVisitorsThirtyDays = stats.thirty_days.length;

    return (
      <div className="container">
      {this.renderStats("Unique Visits", uniqueVisitorsToday, uniqueVisitorsThirtyDays)}
      {this.renderStats("Overall Visits", overallVisitorsToday, overallVisitorsThirtyDays)}
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
