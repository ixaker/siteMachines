import Link from 'next/link';
import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { BreadcrumbProps } from '../title-machine/types';
import { useSelector } from 'react-redux';
import { selectEditor } from '@/store/slice/adminSlice';

const Breadcrumb: React.FC<BreadcrumbProps> = ({ model, type, changeFunction }) => {
  const editor = useSelector(selectEditor);

  const breaDcrumbData = [
    { title: 'Головна', href: '/', arrow: <KeyboardArrowRightIcon /> },
    { title: type, href: '#', arrow: <KeyboardArrowRightIcon />, placeholder: 'ТИП СТАНКУ', key: 'type' },
    { title: model, href: '#', arrow: '', placeholder: 'МОДЕЛЬ СТАНКУ', key: 'model' },
  ];

  return (
    <section className="w-full max-w-[1500px] my-10 mx-auto px-4">
      {editor
        ? breaDcrumbData.slice(1, 3).map((item, index) => (
            <>
              <input
                value={item.title}
                key={index}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  changeFunction(item.key ?? '', e.target.value);
                }}
                type="text"
                placeholder={item.placeholder}
              />{' '}
              {item.arrow}
            </>
          ))
        : breaDcrumbData.map((item, index) => (
            <Link className="text-2xl font-bold" href={item.href} key={index}>
              {item.title} {item.arrow}
            </Link>
          ))}
    </section>
  );
};

export default Breadcrumb;
