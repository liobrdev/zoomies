import { combineReducers } from 'redux';

import { masterReducer, initialMasterState } from './master';


const reducers = {
  master: masterReducer,
};

export const initialAppState = {
  master: initialMasterState,
};

export default combineReducers(reducers);
