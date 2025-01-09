import React from 'react';
import { DataItem } from '@/types/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditor } from '@/store/slice/adminSlice';
import { deleteMachine } from '@/store/slice/dataSlice';
import { AppDispatch } from '@/store/store';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ListCharacteristicsInCard from './ListCharacteristicsInCard';

interface CardProps {
  item: DataItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  const router = useRouter();
  const editor = useSelector(selectEditor);
  const dispatch: AppDispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.id;
    router.push(`/machine?id=${id}`);
  };

  const deleteItem = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      dispatch(deleteMachine(id));
    }
  };

  return (
    <>
      {item ? (
        <>
          <div
            id={item.id}
            onClick={handleClick}
            className=" max-w-[350px] relative  bg-white shadow-md rounded-lg group cursor-pointer transition-all duration-500 ease-in-out "
          >
            {editor ? (
              <IconButton
                aria-label="delete"
                sx={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'white',
                  zIndex: '99',
                }}
                onClick={(e) => deleteItem(e, item.id)}
              >
                <DeleteIcon />
              </IconButton>
            ) : (
              ''
            )}

            <div className="w-full z-[0] sm:z-[1]  group-hover:z-[3] relative max-h-[200px] transition-all duration-500 ease">
              <Image
                src={item.data?.mainImage || ''}
                alt={item.data?.name || ''}
                className="h-full w-auto object-contain rounded-t-lg"
                height={200}
                width={350}
              />
            </div>
            <div className="relative z-[0] sm:z-[1] group-hover:z-[3] bg-white h-[150px] max-h-[150px] px-4 rounded-b-lg  group-hover:rounded-b-none  transition-all duration-500 ease">
              <div className="flex flex-col justify-around h-full">
                <h2 className="text-sm md:text-lg font-semibold text-gray-800 mt-1">{item.data?.name || ''}</h2>

                <div className="flex items-center text-[green] text-sm md:text-lg font-bold">
                  <TaskAltIcon sx={{ marginRight: '8px' }} />В наявності
                </div>
                <div className="flex justify-between items-end">
                  <p className="text:sm md:text-lg font-bold text-primary mt-1">Ціна: {item.data?.price || ''} $</p>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg shadow-sm">
                    Код: {item.data?.article || ''}
                  </span>
                </div>
              </div>
            </div>
            <ListCharacteristicsInCard characteristics={item.data?.characteristics} />
          </div>
        </>
      ) : (
        <>
          <Skeleton sx={{ width: '350px', height: '350px' }} />
        </>
      )}
    </>
  );
};

export default Card;
