import Constants  from '../constants';

const initialState = {
  locations: [],
  errors: null,
  loading: false
};

export default function locationReducer(state = initialState, action) {
  switch(action.type) {
    case Constants.CLEAR_LOCATION_SUGGESTIONS:
      return initialState;
    case Constants.START_LOCATION_NAME_QUERY:
      return { ...state, loading: true, locations: [], errors: null };
    case Constants.LOCATION_NAME_QUERY_RESULT:
      return { ...state, loading: false, locations: action.locations };
    case Constants.LOCATION_NAME_QUERY_ERROR:
      return { ...state, loading: false, locations: [], errors: errors };
    default:
      return state;
  }
}