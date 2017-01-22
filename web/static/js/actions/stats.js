import Constants from '../constants';
import { httpGet } from '../utils';

const Actions = {
  fetchStats: () => (dispatch) => {
    dispatch({ type: Constants.STATS_FETCHING });

    httpGet('/api/v1/user_stats')
      .then((data) => {
        dispatch({
          type: Constants.STATS_RECEIVED,
          stats: data.stats,
        });
      })
      .catch((error) => {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: Constants.FETCH_STATS_ERROR,
            errors: [errorJSON],
          });
        });
      });
  },
};

export default Actions;
