import React, { useEffect, useState } from 'react';
import BuildIcon from '@mui/icons-material/Build';

interface EditableCharacteristicsProps {
  characteristics: { name: string; value: string; viewInCard: boolean }[];
}

const EditableCharacteristics: React.FC<EditableCharacteristicsProps> = ({ characteristics }) => {
  const [localCharacteristics, setLocalCharacteristics] = useState(characteristics);

  useEffect(() => {
    setLocalCharacteristics(characteristics);
  }, [characteristics]);

  return (
    <section className="hidden sm:block">
      <p className="text-xl xl:text-2xl font-semibold text-gray-800 mb-3 w-full text-start">Характеристика верстата:</p>
      <ul className="flex flex-col  gap-4 mt-5 w-full">
        {localCharacteristics.map(
          (item, index) =>
            item.viewInCard && (
              <li
                key={index}
                className="w-full xl:w-[75%] flex justify-between items-center p-3 xl:p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-all ease-in-out duration-200"
              >
                <div className="flex items-center gap-2">
                  <BuildIcon sx={{ fontSize: { md: '18px', lg: '25px' } }} className="text-gray-600" />
                  <span className="font-medium text-sm  xl:text-lg text-gray-800">{item.name}:</span>
                </div>
                <span className="text-sm xl:text-lg text-gray-600 text-end">{item.value}</span>
              </li>
            )
        )}
      </ul>
    </section>
  );
};

export default EditableCharacteristics;
