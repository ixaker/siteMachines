import { useDispatch, useSelector } from 'react-redux';
import Card from './ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { selectEditor } from '@/store/slice/adminSlice';
import NewCard from './ui/NewCard';
import { selectFilteredData } from '@/store/slice/dataSlice';
import FilterMachines from '../custom-select/FilterMachines';
import { AppDispatch } from '@/store/store';
import { setData } from '@/store/slice/filterSlice';

// import { Skeleton } from '@mui/material';

const ListCard = () => {
  const dispatch: AppDispatch = useDispatch();
  const list = useSelector(selectFilteredData);
  const editor = useSelector(selectEditor);
  dispatch(setData(list));

  return (
    <section className="w-full max-w-[1500px]  my-0 mx-auto px-4 flex justify-center md:justify-between mb-40">
      <FilterMachines />

      <div className="flex justify-center items-center">
        <div className="grid grid-wrap w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {list.length > 0 ? (
              list.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col w-full items-center"
                >
                  <Card item={item} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-gray-500 w-full   text-center"
              >
                <p>На жаль немає станків за вашим запитом</p>
              </motion.div>
            )}

            {editor ? <NewCard /> : ''}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ListCard;
