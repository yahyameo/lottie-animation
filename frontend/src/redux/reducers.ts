import { combineReducers } from 'redux';

const initialState = {
  animations: [],
  offline: false,
};

const animationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_ANIMATIONS':
      return { ...state, animations: action.payload };
    case 'SET_OFFLINE':
      return { ...state, offline: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  animation: animationReducer,
});
export type RootState = ReturnType<typeof rootReducer>; 
export default rootReducer;
