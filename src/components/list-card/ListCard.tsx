import { AppDispatch } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';
import { useEffect } from 'react';
import { fetchMachines, selectFilteredData } from '@/store/slice/dataSlice';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../custom-select/CustomSelect';
import { selectEditor } from '@/store/slice/adminSlice';
import NewCard from './NewCard';

const ListCard = () => {
  const dispatch: AppDispatch = useDispatch();
  const list = useSelector(selectFilteredData);

  const editor = useSelector(selectEditor);
  // const machines = useSelector(selectData);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [list.length]);

  return (
    <section className="w-full max-w-[1500px] my-0 mx-auto px-4 flex mb-40">
      <div className="pr-4 w-[25%]">
        <CustomSelect />
      </div>
      <div className="flex justify-center">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                На жаль немає станків за вашим запитом
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
