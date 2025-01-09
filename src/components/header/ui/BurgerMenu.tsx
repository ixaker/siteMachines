import React from 'react';

interface BurgerMenuProps {
  openMenu: boolean;
  setOpenMenu: (arg: boolean) => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ openMenu, setOpenMenu }) => {
  const handleCloseMenu = () => {
    setOpenMenu(!openMenu);
  };
  return (
    <div
      className={`absolute top-0 bg-white w-1/2 h-full transition-all duration-300 ease-in-out ${
        openMenu ? 'left-0' : 'left-[-100%]'
      }`}
    >
      <ul className="flex flex-col items-start p-6">
        <li className="md:text-xl lg:text-2xl text-[#373435] font-bold mb-4">
          <a href="#">Про компанію</a>
        </li>
        <li className="md:text-xl lg:text-2xl text-[#373435] font-bold mb-4">
          <a href="#">Контакти</a>
        </li>
        {/* Можно добавить дополнительные пункты меню */}
      </ul>
    </div>
  );
};

export default BurgerMenu;
