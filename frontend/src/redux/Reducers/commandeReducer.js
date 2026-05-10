import * as types from '../ActionTypes/commandeTypes';

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

const commandeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_COMMANDES_REQUEST:
    case types.FETCH_COMMANDE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.FETCH_COMMANDES_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: null,
      };
    case types.FETCH_COMMANDE_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload,
        error: null,
      };
    case types.FETCH_COMMANDES_FAIL:
    case types.FETCH_COMMANDE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.ADD_COMMANDE_SUCCESS:
      return {
        ...state,
        list: [action.payload, ...state.list],
      };
    case types.UPDATE_COMMANDE_STATUS_SUCCESS:
      return {
        ...state,
        list: state.list.map(c => 
          c._id === action.payload.id 
            ? { ...c, statut_livraison: action.payload.statut }
            : c
        ),
        selected: state.selected?._id === action.payload.id
          ? { ...state.selected, statut_livraison: action.payload.statut }
          : state.selected,
      };
    default:
      return state;
  }
};

export default commandeReducer;