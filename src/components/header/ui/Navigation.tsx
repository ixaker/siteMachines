import Link from 'next/link';
import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className=" gap-5 hidden md:flex">
        <li className="md:text-xl lg:text-2xl text-[#373435] font-bold">
          <a href="#">Про компанію</a>
        </li>
        <li className="md:text-xl lg:text-2xl text-[#373435] font-bold">
          <Link href="/contacts">Контакти</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
