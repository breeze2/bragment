import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import RootReducer from './reducers';
import RootSaga from './sagas';

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
  (window as any).compose;

const sagaMiddleware = createSagaMiddleware();

export const store =
  composeEnhancers && process.env.NODE_ENV === 'development'
    ? createStore(
        RootReducer,
        composeEnhancers(applyMiddleware(sagaMiddleware))
      )
    : createStore(RootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(RootSaga);
