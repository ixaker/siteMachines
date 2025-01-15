'use client';

import ListCard from '@/components/list-card/ListCard';
import { fetchMachines } from '@/store/slice/dataSlice';
import { setData } from '@/store/slice/filterSlice';
import { AppDispatch } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Home = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const loadMachines = async () => {
      try {
        // Загружаем данные машин
        const machines = await dispatch(fetchMachines()).unwrap();
        // Сохраняем данные в состояние фильтра
        dispatch(setData(machines));
      } catch (error) {
        console.error('Ошибка при загрузке машин:', error);
      }
    };

    loadMachines();
  }, [dispatch]);

  return <div className="mt-10">{<ListCard />}</div>;
};

export default Home;
