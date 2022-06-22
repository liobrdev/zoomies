import { IMasterState } from '@/types';


export const initialMasterState: IMasterState = {
  breeds: [],
  limit: 16,
  offset: 0,
  isRetrieving: false,
  hasMore: true,
  errorRetrieve: {},
  searchBarOn: false,
  searchBreed: '',
};

export const masterReducer = (
  state: IMasterState = initialMasterState,
  action: any,
): IMasterState => {
  switch (action.type) {
    case 'START_RETRIEVE_MASTER':
      return { ...state, isRetrieving: true, errorRetrieve: {} };

    case 'STOP_RETRIEVE_MASTER':
      return { ...state, isRetrieving: false };

    case 'SET_LIMIT_OFFSET':
      return { ...state, limit: action.limit, offset: action.offset };

    case 'MASTER_SEARCHBAR_SHOW':
      return { ...state, searchBarOn: true };

    case 'MASTER_SEARCHBAR_CLOSE':
      return { ...state, searchBarOn: false, searchBreed: '' };

    case 'MASTER_SEARCHBAR_INPUT':
      return { ...state, searchBreed: action.searchBreed };

    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.hasMore };

    case 'SET_BREEDS':
      return { ...state, breeds: action.breeds };

    case 'MASTER_ERROR':
      return { ...state, errorRetrieve: action.errorRetrieve };

    case 'MASTER_RESET':
      return { ...initialMasterState };

    default:
      return state;
  }
};
