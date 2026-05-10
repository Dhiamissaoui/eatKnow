import * as types from '../ActionTypes/statsTypes';
import { getDashboardStats } from '../api';

export const fetchStats = () => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_STATS_REQUEST });
    const response = await getDashboardStats();
    dispatch({
      type: types.FETCH_STATS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_STATS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch stats',
    });
  }
};