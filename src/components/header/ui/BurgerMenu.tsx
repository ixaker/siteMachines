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
        className={`absolute top-0 left-0 w-screen bg-black ${openMenu ? 'opacity-10' : 'opacity-0 hidden'}  top-0 h-full z-[0] duration-300 ease-in-out`}
      ></div>
      <div
        className={`absolute top-0 bg-white w-1/2 h-full transition-all duration-300 ease-in-out z-1 ${
          openMenu ? 'left-0' : 'left-[-100%]'
        }`}
      >
        <nav>
          <ul className="flex flex-col items-start bg-white h-full p-6 relative z-1 mt-10">
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
