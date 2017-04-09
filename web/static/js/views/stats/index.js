import React from 'react';
import { connect } from 'react-redux';
import StatsActions from '../../actions/stats';
import { push } from 'react-router-redux';
import fp from 'lodash/fp';

class StatsView extends React.Component {
  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (currentUser) {
      dispatch(StatsActions.fetchStats());
    } else {
      dispatch(push('/'));
    }
  }

  uniqueStats(stats) {
    return fp.uniqBy(stat => stat.ip)(stats);
  }

  renderStats(headline, visitorsToday, visitorsYesterday, visitorsThirtyDays) {
    return (
      <div>
        <h1 className="headline">{headline}</h1>
        <div className="group">
          <div className="today">
            <h3>Today</h3>
            <div className="visitor-count">{visitorsToday} visits</div>
          </div>

          <div className="yesterday">
            <h3>Yesterday</h3>
            <div className="visitor-count">{visitorsYesterday} visits</div>
          </div>
          <div className="thirty-days">
            <h3>Last 30 days</h3>
            <div className="visitor-count">{visitorsThirtyDays} visits</div>
          </div>
        </div>
      </div>
    );
  }

  renderPopularPosts(stats) {
    return (
      <div className="popular-posts">
        {stats.map(stat => <div key={stat.post.slug}><img src={stat.post.image} /></div>)}
      </div>
    );
  }

  render() {
    const { fetching, stats } = this.props;
    if (fetching) {
      return (
        <div className="stats">
          <div>Loading stats</div>
        </div>
      );
    }

    const uniqueVisitorsToday = this.uniqueStats(stats.today).length;
    const uniqueVisitorsYesterday = this.uniqueStats(stats.yesterday).length;
    const uniqueVisitorsThirtyDays = this.uniqueStats(stats.thirty_days).length;

    const overallVisitorsToday = stats.today.length;
    const overallVisitorsYesterday = stats.yesterday.length;
    const overallVisitorsThirtyDays = stats.thirty_days.length;

    return (
      <div className="stats">
        {this.renderPopularPosts(stats.popular_posts)}
        {this.renderStats('Unique Visits', uniqueVisitorsToday, uniqueVisitorsYesterday, uniqueVisitorsThirtyDays)}
        {this.renderStats('Overall Visits', overallVisitorsToday, overallVisitorsYesterday, overallVisitorsThirtyDays)}
      </div>
    );
  }
}

StatsView.propTypes = {
  fetching: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  stats: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetching: state.stats.fetching,
  ...state.stats,
});

export default connect(mapStateToProps)(StatsView);
