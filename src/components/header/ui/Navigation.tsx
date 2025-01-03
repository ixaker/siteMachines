import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="w-full bg-[#4b4b50] mt-10">
      <div className="max-w-[1500px] px-4 mx-auto my-0">
        <ul className="flex justify-between items-center py-2">
          <li className="text-[#dcdcdc] font-bold text-[20px] cursor-pointer">ФРЕЗЕРНИЙ ВЕРСТАТ</li>
          <li className="text-[#dcdcdc] font-bold text-[20px] cursor-pointer">ТОКАРНИЙ ВЕРСТАТ</li>
          <li className="text-[#dcdcdc] font-bold text-[20px] cursor-pointer">ЛАЗЕРНИЙ ВЕРСТАТ</li>
          <li className="text-[#dcdcdc] font-bold text-[20px] cursor-pointer">ШЛІФУВАЛЬНИЙ ВЕРСТАТ</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
