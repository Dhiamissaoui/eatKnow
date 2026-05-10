import * as types from '../ActionTypes/authTypes';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const registerUser = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

const loginUser = (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_REQUEST });
    const response = await registerUser(userData);

    console.log('Register response:', response.data);

    if (response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Token saved to localStorage');
    }

    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data);
    const errorMessage = error.response?.data?.message || "Erreur lors de l'inscription";
    dispatch({
      type: types.REGISTER_FAIL,
      payload: errorMessage,
    });
    return Promise.reject({ message: errorMessage, response: error.response });
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_REQUEST });
    const response = await loginUser(credentials);

    console.log('📝 Login response:', response.data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Token saved:', localStorage.getItem('token'));
      console.log('✅ User saved:', localStorage.getItem('user'));
    } else {
      console.error('❌ No token in response!');
    }

    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    const errorMessage = error.response?.data?.message || 'Email ou mot de passe incorrect';
    dispatch({
      type: types.LOGIN_FAIL,
      payload: errorMessage,
    });
    return Promise.reject({ message: errorMessage, response: error.response });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberMe');
  dispatch({ type: types.LOGOUT });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: types.CLEAR_ERROR });
};

export const restoreSession = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  console.log('🔄 Restoring session - Token:', token ? 'Yes' : 'No');
  console.log('🔄 Restoring session - User:', user ? 'Yes' : 'No');

  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: {
          token,
          user: parsedUser
        }
      });
      console.log('✅ Session restored successfully');
      return true;
    } catch (error) {
      console.error('Error restoring session:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  return false;
};