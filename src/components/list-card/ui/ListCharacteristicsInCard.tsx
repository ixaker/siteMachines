import { Characteristic } from '@/types/types';

interface ListCharacteristicsInCardProps {
  characteristics: Characteristic[];
}

const ListCharacteristicsInCard: React.FC<ListCharacteristicsInCardProps> = ({ characteristics }) => {
  return (
    <div className="px-4 z-[0] mt-3 sm:mt-0 group-hover:z-[2] rounded-b-lg sm:absolute bg-[white] w-full top-0 group-hover:shadow-md transition-all duration-500 ease group-hover:top-[100%] opacity-100">
      <h3 className="text-md font-semibold text-gray-700">Характеристики:</h3>
      <ul className="flex flex-col gap-1 mt-1 pb-3">
        {characteristics?.length > 0 &&
          characteristics
            .filter((item) => item.viewInCard === true)
            .map((item, index) => (
              <li key={index} className="text-sm text-gray-600 flex justify-between">
                <p>
                  <strong>{item.name}:</strong>
                </p>
                <p>{item.value}</p>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default ListCharacteristicsInCard;
