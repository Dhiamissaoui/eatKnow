import * as types from '../ActionTypes/statsTypes';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case types.FETCH_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default statsReducer;