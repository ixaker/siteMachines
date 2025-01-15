import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminHeader from './ui/AdminHeader';
import BurgerMenu from './ui/BurgerMenu';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchComponent from './ui/SearchComponent';
import Navigation from './ui/Navigation';

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <header className="flex flex-col w-full max-w-[1500px] mt-5 my-0 mx-auto px-2 bg-inherit">
      <AdminHeader />
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image alt="Logo" src="/logo.webp" width={44} height={44} className="w-[38px] lg:w-[44px] h-[40px] lg:h-[44px]" loading="lazy" />
          </Link>
          <Link className="md:text-xl lg:text-4xl font-bold" href="/">
            QPART
          </Link>
        </div>

        <SearchComponent variant="desktop" />

        <Navigation />
        <IconButton color="primary" sx={{ display: { md: 'none' }, position: 'relative', zIndex: 10, padding: '0px' }} onClick={handleOpenMenu}>
          {openMenu ? <CloseIcon sx={{ fontSize: '35px', color: 'black' }} /> : <MenuIcon sx={{ fontSize: '35px', color: 'black' }} />}
        </IconButton>
        <BurgerMenu setOpenMenu={setOpenMenu} openMenu={openMenu} />
      </div>

      <SearchComponent variant="mobile" />
    </header>
  );
};

export default Header;
