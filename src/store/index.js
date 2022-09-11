import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import rootSagas from "./sagas";
import createSagaMiddleware from "redux-saga";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const sagaMiddleware = createSagaMiddleware();

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const middleware = [];
  middleware.push(sagaMiddleware);

  const enhancer = compose(applyMiddleware(sagaMiddleware));

  const store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store);

  sagaMiddleware.run(rootSagas);

  return { store, persistor };
};
