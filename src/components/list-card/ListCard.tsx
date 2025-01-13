import { useDispatch, useSelector } from 'react-redux';
import Card from './ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { selectEditor } from '@/store/slice/adminSlice';
import NewCard from './ui/NewCard';
import { selectFilteredData } from '@/store/slice/dataSlice';
import FilterMachines from '../custom-select/FilterMachines';
import { AppDispatch } from '@/store/store';
import { setData } from '@/store/slice/filterSlice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';

// import { Skeleton } from '@mui/material';

const ListCard = () => {
  const dispatch: AppDispatch = useDispatch();
  const list = useSelector(selectFilteredData);
  const editor = useSelector(selectEditor);
  const [loading, setLoading] = useState(true);
  dispatch(setData(list));

  useEffect(() => {
    if (list[0]?.id.length > 0) {
      setLoading(false);
    }
  }, [list]);

  return (
    <section className="w-full max-w-[1500px]  my-0 mx-auto px-2 flex justify-center md:justify-between mb-40">
      <FilterMachines />

      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {loading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    sx={{ width: '350px', height: { xs: '452px', sm: '350px' }, display: 'block' }}
                    variant="rectangular"
                    animation="wave"
                  />
                ))}
              </>
            ) : list.length > 0 ? (
              list.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col w-full items-center"
                >
                  <Link href={`/machine?id=${item.id}`} scroll={false}>
                    <Card item={item} />
                  </Link>
                </motion.div>
              ))
            ) : (
              <p>На жаль немає станків за вашим запитом</p>
            )}
            {editor ? <NewCard /> : ''}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ListCard;
