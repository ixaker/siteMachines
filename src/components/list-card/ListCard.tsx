// import { useDispatch, useSelector } from 'react-redux';
// import Card from './ui/Card';
// import { motion, AnimatePresence } from 'framer-motion';
// import { selectEditor } from '@/store/slice/adminSlice';
// import NewCard from './ui/NewCard';
// import { selectFilteredData } from '@/store/slice/dataSlice';
// import FilterMachines from '../custom-select/FilterMachines';
// import { AppDispatch } from '@/store/store';
// import { setData } from '@/store/slice/filterSlice';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { Skeleton } from '@mui/material';

// // import { Skeleton } from '@mui/material';

// const ListCard = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const list = useSelector(selectFilteredData);
//   const editor = useSelector(selectEditor);
//   const [loading, setLoading] = useState(true);
//   dispatch(setData(list));

//   useEffect(() => {
//     if (list[0]?.id.length > 0) {
//       setLoading(false);
//     }
//   }, [list]);

//   return (
//     <section className="w-full max-w-[1500px]  my-0 mx-auto px-2 flex justify-center md:justify-between mb-40">
//       <FilterMachines />

//       <div className="flex justify-center items-center">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           <AnimatePresence>
//             {loading ? (
//               <>
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <Skeleton
//                     key={index}
//                     sx={{ width: '350px', height: { xs: '452px', sm: '350px' }, display: 'block' }}
//                     variant="rectangular"
//                     animation="wave"
//                   />
//                 ))}
//               </>
//             ) : list.length > 0 ? (
//               list.map((item, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.3 }}
//                   className="flex flex-col w-full items-center"
//                 >
//                   <Link href={`/machine?id=${item.id}`} scroll={false}>
//                     <Card item={item} />
//                   </Link>
//                 </motion.div>
//               ))
//             ) : (
//               <p>На жаль немає станків за вашим запитом</p>
//             )}
//             {editor ? <NewCard /> : ''}
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ListCard;

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
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@mui/material';
import { FixedSizeGrid as ReactGrid } from 'react-window';

const ListCard = () => {
  const dispatch: AppDispatch = useDispatch();
  const list = useSelector(selectFilteredData);
  const editor = useSelector(selectEditor);
  const [loading, setLoading] = useState(true);
  const elementRef = useRef(null);
  const [widthList, setWidthList] = useState(370);
  const [columnCount, setColumnCount] = useState(1);
  const [rowCount, setRowCount] = useState(3);

  dispatch(setData(list));

  console.log('widthList', widthList);
  console.log('columnCount', columnCount);
  console.log('rowCount', rowCount);
  console.log('list lenght', list.length);

  useEffect(() => {
    if (list[0]?.id.length > 0) {
      setLoading(false);
    }

    let colCount = Math.floor(widthList / 370);
    if (colCount < 1) {
      colCount = 1;
    }
    setColumnCount(colCount);
    const row = Math.ceil(list.length / Math.floor(widthList / 370));

    setRowCount(row);
    console.log(list);
  }, [list]);

  console.log('widthList', widthList);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      console.log('entries', entries);

      for (const entry of entries) {
        setWidthList(entry.contentRect.width); // Обновляем ширину элемента
        setColumnCount(Math.floor(entry.contentRect.width / 370));
      }
    });

    resizeObserver.observe(element); // Начинаем отслеживать элемент

    return () => {
      resizeObserver.disconnect(); // Останавливаем наблюдение при размонтировании
    };
  }, []);

  console.log('columnCount2', columnCount);

  return (
    <section className="w-full max-w-[1500px] my-0 mx-auto px-2 flex justify-center md:justify-between mb-40">
      <FilterMachines />

      <div className="flex justify-center items-center w-full">
        <div className="w-full" ref={elementRef}>
          <AnimatePresence>
            {loading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    sx={{
                      width: '350px',
                      height: '350px', // Высота элементов
                      display: 'block',
                    }}
                    variant="rectangular"
                    animation="wave"
                  />
                ))}
              </>
            ) : list.length > 0 ? (
              <ReactGrid
                className="w-full"
                height={800} // Высота контейнера
                rowHeight={350}
                rowCount={rowCount}
                width={widthList} // Ширина контейнера
                columnCount={columnCount} // Количество колонок
                columnWidth={370} // Ширина колонки
              >
                {({ columnIndex, rowIndex, style }) => {
                  const index = rowIndex * columnCount + columnIndex;
                  return (
                    index < list.length && (
                      <div style={style} className="flex justify-center mb-5">
                        <Link href={`/machine?id=${list[index].id}`} scroll={false}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col w-full items-center"
                          >
                            <Card item={list[index]} />
                          </motion.div>
                        </Link>
                      </div>
                    )
                  );
                }}
              </ReactGrid>
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
