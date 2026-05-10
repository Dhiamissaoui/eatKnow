import * as types from '../ActionTypes/platTypes';

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

const platReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PLATS_REQUEST:
    case types.FETCH_PLAT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_PLATS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: null,
      };
    case types.FETCH_PLAT_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload,
        error: null,
      };
    case types.FETCH_PLATS_FAIL:
    case types.FETCH_PLAT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.ADD_PLAT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    case types.UPDATE_PLAT_SUCCESS:
      return {
        ...state,
        list: state.list.map(p => p._id === action.payload._id ? action.payload : p),
        selected: state.selected?._id === action.payload._id ? action.payload : state.selected,
      };
    case types.DELETE_PLAT_SUCCESS:
      return {
        ...state,
        list: state.list.filter(p => p._id !== action.payload),
        selected: state.selected?._id === action.payload ? null : state.selected,
      };
    case types.CLEAR_SELECTED_PLAT:
      return {
        ...state,
        selected: null,
      };
    default:
      return state;
  }
};

export default platReducer;