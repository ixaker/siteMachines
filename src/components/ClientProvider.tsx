'use client';

import { Provider } from 'react-redux';
import store from '@/store/store';
import Header from './header/Header';

import { useEffect } from 'react';
import { fetchAdminStatus } from '@/store/slice/adminSlice';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const { dispatch } = store;

  useEffect(() => {
    // Проверка статуса администратора при загрузке приложения
    dispatch(fetchAdminStatus());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Header />
      {/* <Navigation /> */}
      {children}
    </Provider>
  );
}
