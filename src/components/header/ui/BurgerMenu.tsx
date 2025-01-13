import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BurgerMenuProps {
  openMenu: boolean;
  setOpenMenu: (arg: boolean) => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ openMenu, setOpenMenu }) => {
  return (
    <>
      <div
        onClick={() => {
          setOpenMenu(false);
        }}
        className={`absolute top-0 left-0 w-screen bg-black ${openMenu ? 'opacity-10' : 'opacity-0 hidden'}  top-0 h-full z-[4] duration-300 ease-in-out`}
      ></div>
      <div
        className={`absolute top-0 bg-white w-1/2 h-full transition-all duration-300 ease-in-out z-[5] ${
          openMenu ? 'left-0' : 'left-[-100%]'
        }`}
      >
        <nav className="mt-10">
          <div className="flex items-center gap-2 px-2">
            <Link href="/">
              <Image
                alt="Logo"
                src="/logo.webp"
                width={44}
                height={44}
                className="w-[38px] lg:w-[44px] h-[40px] lg:h-[44px]"
                loading="lazy"
              />
            </Link>
            <Link className="md:text-xl lg:text-4xl font-bold" href="/">
              QPART
            </Link>
          </div>
          <ul className="flex flex-col items-start bg-white h-full py-6 px-2 relative z-1">
            <li className="md:text-xl lg:text-2xl text-[#373435] font-bold mb-4">
              <a href="#">Про компанію</a>
            </li>
            <li className="md:text-xl lg:text-2xl text-[#373435] font-bold mb-4">
              <a href="#">Контакти</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default BurgerMenu;
