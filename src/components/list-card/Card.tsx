import React from 'react';
import { DataItem } from '@/types/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditor } from '@/store/slice/adminSlice';
import { deleteMachine } from '@/store/slice/dataSlice';
import { AppDispatch } from '@/store/store';

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
    <div
      id={item.id}
      onClick={handleClick}
      className="w-[350px] max-w-[350px] relative z-10 bg-white shadow-md rounded-lg group cursor-pointer transition-all duration-500 ease-in-out "
    >
      {editor ? (
        <IconButton
          aria-label="delete"
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'white',
            zIndex: '11',
          }}
          onClick={(e) => deleteItem(e, item.id)}
        >
          <DeleteIcon />
        </IconButton>
      ) : (
        ''
      )}

      <div className="w-full relative z-10 max-h-[200px]">
        <Image
          src={item.data?.mainImage || ''}
          alt={item.data?.name || ''}
          className="h-full w-auto object-contain rounded-t-lg"
          height={200}
          width={350}
        />
      </div>
      <div className="relative z-10 bg-white h-[150px] max-h-[150px] px-4 rounded-b-lg  group-hover:rounded-b-none">
        <div className="flex flex-col justify-around h-full">
          <h2 className="text-lg font-semibold text-gray-800  mt-1">{item.data?.name || ''}</h2>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.data?.description || ''}</p>
          <p className="text-lg font-bold text-primary mt-1">Ціна: {item.data?.price || ''} грн</p>
        </div>
      </div>
      <div className="px-4 rounded-b-lg absolute bg-[white] w-full top-0 group-hover:shadow-md transition-all duration-500 ease group-hover:top-[100%]">
        <h3 className="text-md font-semibold text-gray-700">Характеристики:</h3>
        <ul className="flex flex-col gap-1 mt-1 pb-1">
          {item.data?.characteristics.length > 0 &&
            item.data?.characteristics.map((char, index) => (
              <>
                {char.viewInCard === true && (
                  <li key={index} className="text-sm text-gray-600">
                    <strong>{char.name}:</strong> {char.value}
                  </li>
                )}
              </>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
