import { AppDispatch } from '@/store/store';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { setData } from '@/store/slice/filterSlice';
import { selectData } from '@/store/slice/dataSlice';
import CloseIcon from '@mui/icons-material/Close';
import FilterMachines from '@/components/custom-select/FilterMachines';

interface SearchComponentProps {
  variant: 'mobile' | 'desktop';
}

const SearchComponent: React.FC<SearchComponentProps> = ({ variant }) => {
  const [filter, setFilterValue] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector(selectData);
  const [loading, setLoading] = useState(true);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout>();
  const [openFilter, setOpenFilter] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value);
  };

  function replaceLetters(str: string): string {
    const map: Record<string, string> = {
      а: 'a',
      в: 'b',
      е: 'e',
      к: 'k',
      м: 'm',
      н: 'h',
      о: 'o',
      р: 'p',
      с: 'c',
      т: 't',
      у: 'y',
      х: 'x',
      a: 'а',
      b: 'в',
      e: 'е',
      k: 'к',
      m: 'м',
      h: 'н',
      o: 'о',
      p: 'р',
      c: 'с',
      t: 'т',
      y: 'у',
      x: 'х',
    };

    return str
      .split('')
      .map((char) => map[char] || char) // Заменяем символ, если он есть в `map`
      .join('');
  }

  const filterData = data?.filter((item) => {
    const MIN_LENGTH_SEARCH = 3;

    if (filter.length < MIN_LENGTH_SEARCH) {
      return true;
    }

    const arrayFilter = filter.toLowerCase().split(' ').filter(Boolean);

    const arraySearch: string[] = [];
    const article = item.data.article.toLowerCase().replace(/\s+/g, ''); // Убираем пробелы из артикля

    const convertedArticle = replaceLetters(article);
    const name = item.data.name.toLowerCase().replace(/\s+/g, ''); // Убираем пробелы из имени

    arraySearch.push(article);
    arraySearch.push(convertedArticle);
    arraySearch.push(name);

    let result: boolean = true;

    arrayFilter.forEach((filterItem) => {
      let find: boolean = false;

      arraySearch.forEach((serachItem) => {
        const include = serachItem.includes(filterItem);

        if (include) {
          find = true;
          return;
        }
      });

      result = result && find;
    });

    return result;
  });
  useEffect(() => {
    if (loading) {
      setLoading(false);
      return;
    }
    clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      dispatch(setData(filterData));
    }, 500);
    setSearchTimer(timer);
  }, [filter, dispatch]);

  const searchVariant = {
    mobile: 'flex flex-col md:hidden w-full',
    desktop: 'hidden md:flex w-1/3',
  }[variant];

  return (
    <>
      <div className={`${searchVariant}  mt-4 gap-1 `}>
        <div className="flex w-full items-center">
          <div className="relative flex items-center w-full border-2 border-[#76767a] rounded-full p-2 shadow-sm">
            <input
              value={filter}
              onChange={handleFilterChange}
              type="text"
              placeholder="Пошук по моделі"
              className="border-none focus:outline-none focus:ring-inherit rounded-lg w-full"
            />
            <SearchIcon />
            {filter.length > 0 ? <CloseIcon onClick={() => setFilterValue('')} sx={{ position: 'absolute', right: '8%', cursor: 'pointer' }} /> : ''}
          </div>
          <div className="block md:hidden relative">
            <IconButton onClick={() => setOpenFilter(!openFilter)} color="primary" sx={{ padding: '0px' }}>
              <FilterAltIcon sx={{ fontSize: '35px', color: 'black' }} />
            </IconButton>
          </div>
        </div>

        <div className={`pl-4  ${openFilter ? 'flex' : 'hidden'}`}>
          <FilterMachines variant="mobile" />
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
