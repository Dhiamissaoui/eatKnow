import { combineReducers } from 'redux';
import authReducer from './authReducer';
import restaurantReducer from './restaurantReducer';
import platReducer from './platReducer';
import commandeReducer from './commandeReducer';
import userReducer from './userReducer';
import statsReducer from './statsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  restaurants: restaurantReducer,
  plats: platReducer,
  commandes: commandeReducer,
  users: userReducer,
  stats: statsReducer,
});

export default rootReducer;