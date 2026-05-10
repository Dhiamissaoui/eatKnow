import * as types from '../ActionTypes/commandeTypes';
import { getCommandes, getCommandeById, createCommande, updateCommandeStatus } from '../api';

export const fetchCommandes = () => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_COMMANDES_REQUEST });
    const response = await getCommandes();
    dispatch({
      type: types.FETCH_COMMANDES_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_COMMANDES_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch commandes',
    });
  }
};

export const fetchCommandeById = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_COMMANDE_REQUEST });
    const response = await getCommandeById(id);
    dispatch({
      type: types.FETCH_COMMANDE_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_COMMANDE_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch commande',
    });
  }
};

export const addCommande = (data) => async (dispatch) => {
  try {
    const response = await createCommande(data);
    dispatch({
      type: types.ADD_COMMANDE_SUCCESS,
      payload: response.data.data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCommandeStatusById = (id, statut) => async (dispatch) => {
  try {
    const response = await updateCommandeStatus(id, statut);
    dispatch({
      type: types.UPDATE_COMMANDE_STATUS_SUCCESS,
      payload: { id, statut: response.data.data.statut_livraison },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};