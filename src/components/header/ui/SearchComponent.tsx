import { setFilter } from '@/store/slice/dataSlice';
import { AppDispatch } from '@/store/store';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface SearchComponentProps {
  variant: 'mobile' | 'desktop';
}

const SearchComponent: React.FC<SearchComponentProps> = ({ variant }) => {
  const [filter, setFilterValue] = useState('');
  const dispatch: AppDispatch = useDispatch();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value); // Обновляем локальное состояние
    dispatch(setFilter(value)); // Обновляем фильтр в Redux
  };

  const searchVariant = {
    mobile: 'flex md:hidden w-full',
    desktop: 'hidden md:flex  w-1/3',
  }[variant];

  return (
    <div className={`${searchVariant} items-center  mt-4 gap-1`}>
      <div className="flex items-center w-full border-2 border-[#76767a] rounded-full p-2 shadow-sm">
        <input
          value={filter}
          onChange={handleFilterChange}
          type="text"
          placeholder="Фрезерний верстат з ЧПК Vector 0906F Z150"
          className="border-none focus:outline-none focus:ring-inherit rounded-lg w-full"
        />
        <SearchIcon />
      </div>
      <div className="block md:hidden relative ">
        <IconButton color="primary" sx={{ padding: '0px' }}>
          <FilterAltIcon sx={{ fontSize: '35px', color: 'black' }} />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchComponent;
