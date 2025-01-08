import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { BreadcrumbProps } from '../title-machine/types';
import { useSelector } from 'react-redux';
import { selectEditor } from '@/store/slice/adminSlice';
import ApiClient, { Type } from '@/store/slice/db';

const api = new ApiClient('https://machines.qpart.com.ua/');

const Breadcrumb: React.FC<BreadcrumbProps> = ({ model, type, changeFunction }) => {
  const editor = useSelector(selectEditor);
  const [types, setTypes] = useState<Type[]>([]);

  useEffect(() => {
    api
      .getTypes()
      .then((res) => setTypes(res))
      .catch(console.error);
  }, []);

  const typeMachine: string = types.find((val) => val.id.toString() === type)?.name.toString() || '';

  const breaDcrumbData = [
    { title: 'Головна', href: '/', arrow: <KeyboardArrowRightIcon /> },
    { title: typeMachine, href: '/', arrow: <KeyboardArrowRightIcon />, placeholder: 'ТИП СТАНКУ', key: 'type' },
    { title: model, href: '#', arrow: '', placeholder: 'МОДЕЛЬ СТАНКУ', key: 'model' },
  ];

  return (
    <section className="w-full max-w-[1500px] my-10 mx-auto px-4">
      {editor
        ? breaDcrumbData.slice(1, 3).map((item, index) => (
            <>
              <input
                className="text-2xl font-bold capitalize "
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
            <Link className="text-2xl font-bold capitalize" href={item.href} key={index}>
              {item.title.toLowerCase()} {item.arrow}
            </Link>
          ))}
    </section>
  );
};

export default Breadcrumb;
