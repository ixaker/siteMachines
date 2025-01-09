import SearchIcon from '@mui/icons-material/Search';
import { AppDispatch } from '@/store/store';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { setFilter } from '@/store/slice/dataSlice';
import AdminHeader from './ui/AdminHeader';
import BurgerMenu from './ui/BurgerMenu';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [filter, setFilterValue] = useState('');
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value); // Обновляем локальное состояние
    dispatch(setFilter(value)); // Обновляем фильтр в Redux
  };

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <header className="flex flex-col w-full max-w-[1500px] mt-10 my-0 mx-auto px-4 bg-inherit">
      <AdminHeader />
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image
              alt="Logo"
              src="/logo.webp"
              width={44}
              height={44}
              className="w-[38px] lg:w-[44px] h-[40px] lg:h-[44px]"
            />
          </Link>
          <Link className="md:text-xl lg:text-4xl font-bold" href="/">
            QPART
          </Link>
        </div>
        <div className="hidden md:flex items-center w-1/3 border-2 border-[#76767a] rounded-full p-2 shadow-sm">
          <input
            value={filter}
            onChange={handleFilterChange}
            type="text"
            placeholder="Фрезерний верстат з ЧПК Vector 0906F Z150"
            className="border-none focus:outline-none focus:ring-inherit rounded-lg w-full"
          />
          <SearchIcon className="ml-2" />
        </div>
        <ul className=" gap-5 hidden md:flex">
          <li className="md:text-xl lg:text-2xl text-[#373435] font-bold">
            <a href="#">Про компанію</a>
          </li>
          <li className="md:text-xl lg:text-2xl text-[#373435] font-bold">
            <a href="#">Контакти</a>
          </li>
        </ul>
        <IconButton onClick={handleOpenMenu}>
          <MenuIcon />
        </IconButton>
        <BurgerMenu setOpenMenu={setOpenMenu} openMenu={openMenu} />
      </div>

      <div className="flex md:hidden mt-4 items-center w-full border-2 border-[#76767a] rounded-full p-2 shadow-sm">
        <input
          value={filter}
          onChange={handleFilterChange}
          type="text"
          placeholder="Фрезерний верстат з ЧПК Vector 0906F Z150"
          className="border-none focus:outline-none focus:ring-inherit rounded-lg w-full"
        />
        <SearchIcon className="ml-2" />
      </div>
    </header>
  );
};

export default Header;
