import Constants from '../constants';

const initialState = {
  stats: [],
  fetching: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.STATS_FETCHING:
      return { ...state, fetching: true };
    case Constants.STATS_RECEIVED:
      return { ...state, stats: action.stats, fetching: false };
    default:
      return state;
  }
}
