import * as types from '../ActionTypes/restaurantTypes';

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_RESTAURANTS_REQUEST:
    case types.FETCH_RESTAURANT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: null,
      };
    case types.FETCH_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload,
        error: null,
      };
    case types.FETCH_RESTAURANTS_FAIL:
    case types.FETCH_RESTAURANT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.ADD_RESTAURANT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    case types.UPDATE_RESTAURANT_SUCCESS:
      return {
        ...state,
        list: state.list.map(r => r._id === action.payload._id ? action.payload : r),
        selected: state.selected?._id === action.payload._id ? action.payload : state.selected,
      };
    case types.DELETE_RESTAURANT_SUCCESS:
      return {
        ...state,
        list: state.list.filter(r => r._id !== action.payload),
        selected: state.selected?._id === action.payload ? null : state.selected,
      };
    case types.CLEAR_SELECTED_RESTAURANT:
      return {
        ...state,
        selected: null,
      };
    default:
      return state;
  }
};

export default restaurantReducer;