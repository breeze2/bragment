import { createStore } from 'redux';
import RootReducer from './reducers';
const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
  (window as any).compose;

export const store =
  composeEnhancers && process.env.NODE_ENV === 'development'
    ? createStore(RootReducer, composeEnhancers())
    : createStore(RootReducer);
