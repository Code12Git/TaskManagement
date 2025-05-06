import { legacy_createStore as createStore, applyMiddleware, combineReducers, compose, Reducer } from 'redux';
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { storage } from '@/lib/storage';
import taskReducer from './reducers/taskreducer';
import authReducer from './reducers/authreducer';
import { taskState, userState } from '@/types';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','tasks'],
};

const rootReducer = combineReducers({
  tasks: taskReducer as unknown as Reducer<taskState>,
  auth: authReducer as unknown as Reducer<userState>
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  compose(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
export type AppDispatch = typeof store.dispatch;