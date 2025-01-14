import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { BreadcrumbProps } from '../title-machine/types';
import { useSelector } from 'react-redux';
import { selectEditor } from '@/store/slice/adminSlice';
import ApiClient, { Type } from '@/store/slice/db';

const api = new ApiClient();

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
    { title: 'Головна', href: '/', arrow: <KeyboardArrowRightIcon sx={{ fontSize: { xs: '14px', sm: '30px' } }} /> },
    {
      title: typeMachine,
      href: '/',
      arrow: <KeyboardArrowRightIcon sx={{ fontSize: { xs: '14px', sm: '30px' } }} />,
      placeholder: 'ТИП СТАНКУ',
      key: 'type',
    },
    { title: model, href: '#', arrow: '', placeholder: 'МОДЕЛЬ СТАНКУ', key: 'model' },
  ];

  return (
    <section className="my-5 sm:my-10 flex items-center">
      {editor
        ? breaDcrumbData.slice(1, 3).map((item, index) => (
            <div key={index}>
              <input
                className="text-2xl font-bold capitalize "
                value={item.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  changeFunction(item.key ?? '', e.target.value);
                }}
                type="text"
                placeholder={item.placeholder}
              />{' '}
              {item.arrow}
            </div>
          ))
        : breaDcrumbData.map((item, index) => (
            <Link className="text-[12px] sm:text-xl md:text-2xl font-bold capitalize" href={item.href} key={index + 1}>
              {item.title.toLowerCase()} {item.arrow}
            </Link>
          ))}
    </section>
  );
};

export default Breadcrumb;
