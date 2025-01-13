'use client';

import { Email, Phone, Room } from '@mui/icons-material';
import dynamic from 'next/dynamic';

const DynamicInteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false, // Отключаем SSR для этого компонента
});

const Contacts = () => {
  const listContacts = [
    {
      title: 'Адреса',
      description: 'вулиця Яхненківська, 2, м. Дніпро, Дніпропетровська область, 49025, Україна',
      id: 'address',
    },
    { title: 'Пошта', description: 'info@qpart.com.ua', id: 'email' },
    { title: 'Телефон', description: '+380989950760', id: 'phone' },
  ];

  const requiredItem = (id: string, title: string, description: string) => {
    let href = `tel:${description}`;
    let Icon: React.ElementType = Phone;

    if (id === 'address') {
      href = 'https://maps.app.goo.gl/jPbgbWosaTq8GeNe7';
      Icon = Room;
    } else if (id === 'email') {
      href = `mailto:${description}`;
      Icon = Email;
    }

    return (
      <div className="flex gap-[30px] items-center">
        <a target="_blank" href={href} aria-label={title}>
          <button className="shadow-[0_10px_30px_#000] rounded-full pt-[16px] pl-[18px] pr-[18px] pb-[16px] md:p-4">
            <Icon className="md:size-[35px] lg:size-[40px]" />
          </button>
        </a>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold md:text-[25px] ">{title}</span>
          <span className="text-[12px] font-extralight md:text-[15px]  ">{description}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-w-screen min-h-[calc(100vh-140px)] flex flex-col justify-center pb-[20px] relative z-10">
        <div className="min-w-screen px-4 py-8 mt-[130px] md:mt-[150px] lg:mt-[170px] xl:mt-[200px]">
          <h1></h1>
          <div className="mt-[20px] flex justify-center items-center ">
            <ul className="flex flex-col gap-10 w-auto">
              {listContacts.map((item, index) => (
                <li key={index}>{requiredItem(item.id, item.title, item.description)}</li>
              ))}
            </ul>
            <DynamicInteractiveMap />
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
