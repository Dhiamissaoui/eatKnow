import * as types from '../ActionTypes/userTypes';
import { getUsers, getUserById, deleteUser } from '../api';

export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_USERS_REQUEST });
    const response = await getUsers();
    dispatch({
      type: types.FETCH_USERS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_USERS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch users',
    });
  }
};

export const fetchUserById = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_USER_REQUEST });
    const response = await getUserById(id);
    dispatch({
      type: types.FETCH_USER_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_USER_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch user',
    });
  }
};

export const deleteUserById = (id) => async (dispatch) => {
  try {
    await deleteUser(id);
    dispatch({
      type: types.DELETE_USER_SUCCESS,
      payload: id,
    });
  } catch (error) {
    throw error;
  }
};