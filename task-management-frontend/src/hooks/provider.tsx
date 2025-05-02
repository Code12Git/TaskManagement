'use client';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import type { ReactNode } from 'react';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const persistor = persistStore(store);
  
  return (
    <Provider store={store}>
      <PersistGate 
        loading={null} 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}