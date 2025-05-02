import { legacy_createStore as createStore, applyMiddleware, combineReducers, compose ,Reducer} from 'redux';
import {thunk }from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import taskReducer from './reducers/taskreducer';
import { taskState } from '@/types';

 const persistConfig = {
  key: 'root',
  storage,
};

 const rootReducer = combineReducers({
    tasks:taskReducer as unknown as Reducer<taskState>
});

export type RootState = ReturnType<typeof rootReducer>;

 const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

 const store = createStore(
  persistedReducer,
  compose(applyMiddleware(thunk))
);

 const persistor = persistStore(store);

export { store, persistor };
export type AppDispatch = typeof store.dispatch
