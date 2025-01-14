import { useSelector } from 'react-redux';
import Card from './ui/Card';
import { selectEditor } from '@/store/slice/adminSlice';
import NewCard from './ui/NewCard';
import FilterMachines from '../custom-select/FilterMachines';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { DataItem } from '@/types/types';
import { getFilterData } from '@/store/slice/filterSlice';

const ListCard = () => {
  const filterData = useSelector(getFilterData);

  const list = filterData;
  const editor = useSelector(selectEditor);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<DataItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(9);
  const [countFirstViewElement, setCountFirstViewElement] = useState<number>(3);

  useEffect(() => {
    if (loading) {
      if (list[0]?.id.length > 0) {
        setLoading(false);
        setVisibleCards(list.slice(0, countFirstViewElement));
      }
    } else {
      setVisibleCards(list.slice(0, countFirstViewElement));
      setCurrentIndex(9);
    }
  }, [list]);

  const loadMoreCards = () => {
    const nextIndex = currentIndex + 3;
    setVisibleCards((prev) => [...prev, ...list.slice(currentIndex, nextIndex)]);
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    const widthDesctop = window.innerWidth;

    if (widthDesctop > 1024) {
      setCountFirstViewElement(9);
    } else if (widthDesctop > 640) {
      setCountFirstViewElement(6);
    } else if (widthDesctop < 640) {
      setCountFirstViewElement(3);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 260 && currentIndex < list.length) {
        loadMoreCards();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex, list.length]); // Добавляем зависимость от currentIndex

  return (
    <section className="w-full max-w-[1500px]  my-0 mx-auto px-2 flex justify-center md:justify-between mb-40">
      <FilterMachines variant="desktop" />

      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {editor ? <NewCard /> : ''}
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
          ) : visibleCards.length > 0 ? (
            visibleCards.map((item, index) => <Card key={index} item={item} />)
          ) : (
            <p>На жаль немає станків за вашим запитом</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListCard;
