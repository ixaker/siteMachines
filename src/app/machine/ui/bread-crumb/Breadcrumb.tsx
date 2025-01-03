import Link from 'next/link';
import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { BreadcrumbProps } from '../title-machine/types';

const Breadcrumb: React.FC<BreadcrumbProps> = ({ model, type }) => {
  const breaDcrumbData = [
    { title: 'Головна', href: '/', arrow: <KeyboardArrowRightIcon /> },
    { title: type, href: '#', arrow: <KeyboardArrowRightIcon /> },
    { title: model, href: '#', arrow: '' },
  ];

  return (
    <section className="w-full max-w-[1500px] my-10 mx-auto px-4">
      {breaDcrumbData.map((item, index) => (
        <Link className="text-2xl font-bold" href={item.href} key={index}>
          {item.title} {item.arrow}
        </Link>
      ))}
    </section>
  );
};

export default Breadcrumb;
