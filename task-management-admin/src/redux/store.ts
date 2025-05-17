import { legacy_createStore as createStore, applyMiddleware, combineReducers, compose, Reducer } from 'redux';
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import authReducer from './reducers/authReducer';
import { authState, taskState, userState } from '@/types/index';
import userReducer from './reducers/userReducer';
import taskReducer from './reducers/taskReducer';
 

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','user','task'],
};

const rootReducer = combineReducers({
   auth: authReducer as unknown as Reducer<authState>,
   user: userReducer as unknown as Reducer<userState>,
   task: taskReducer as unknown as Reducer<taskState>
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