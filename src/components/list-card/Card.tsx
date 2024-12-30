import React from "react";
import { DataItem } from "@/types/types";
import { useRouter } from "next/navigation";

interface CardProps {
  item: DataItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.id;
    router.push(`/machine?id=${id}`);
  };
  return (
    <div
      id={item.id}
      onClick={handleClick}
      className="max-w-[350px] relative bg-white shadow-md rounded-lg group cursor-pointer transition-all duration-500 ease-in-out "
    >
      <div className="h-[200px] w-full bg-gray-100 flex items-center justify-center">
        <img
          src={item.data.mainImage}
          alt={item.data.name}
          className="h-full w-auto object-contain"
        />
      </div>
      <div className="p-4 pb-0 flex flex-col gap-2 ">
        <div className="bg-white z-[3] pb-[10px]">
          <h2 className="text-lg font-semibold text-gray-800 ">
            {item.data.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.data.description}
          </p>
          <p className="text-lg font-bold text-primary">
            Ціна: 5000{item.data.price} грн
          </p>
        </div>

        <div className="p-4 shadow-md w-full absolute rounded-b-lg  z-[1] left-0 bg-white bottom-[0px] group-hover:bottom-[-142px] group-hover:z-[1]  transition-all duration-500 ease">
          <h3 className="text-md font-semibold text-gray-700">
            Характеристики:
          </h3>
          <ul className="mt-2 space-y-1">
            {item.data.characteristics.map((char, index) => (
              <li key={index} className="text-sm text-gray-600">
                <strong>{char.name}:</strong> {char.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
