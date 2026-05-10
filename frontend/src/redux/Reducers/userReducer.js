import * as types from '../ActionTypes/userTypes';

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USERS_REQUEST:
    case types.FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: null,
      };
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload,
        error: null,
      };
    case types.FETCH_USERS_FAIL:
    case types.FETCH_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.DELETE_USER_SUCCESS:
      return {
        ...state,
        list: state.list.filter(u => u._id !== action.payload),
        selected: state.selected?._id === action.payload ? null : state.selected,
      };
    default:
      return state;
  }
};

export default userReducer;