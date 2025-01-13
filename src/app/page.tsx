'use client';

import ListCard from '@/components/list-card/ListCard';
import { fetchMachines } from '@/store/slice/dataSlice';
import { AppDispatch } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Home = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMachines());
  }, []);

  return <div className="mt-10">{<ListCard />}</div>;
};

export default Home;
