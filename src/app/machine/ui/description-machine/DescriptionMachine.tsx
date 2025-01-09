import { selectEditor } from '@/store/slice/adminSlice';
import React from 'react';
import { useSelector } from 'react-redux';

interface DescriptionMachineProps {
  description: string;
  changeFunction: (val: string) => void;
}

const DescriptionMachine: React.FC<DescriptionMachineProps> = ({ description, changeFunction }) => {
  const editor = useSelector(selectEditor);

  return (
    <article>
      {editor ? (
        <div className="flex flex-col">
          <label className="text-2xl font-bold">Опис</label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeFunction(e.target.value);
            }}
            value={description}
            type="text"
            className="text-[18px] mt-5 border rounded px-2"
            placeholder="Опис Станку"
          />
        </div>
      ) : description.length > 0 ? (
        <div className="flex flex-col">
          <label className="text-2xl font-bold">Опис</label>
          <p className="text-[18px] mt-5">{description}</p>
        </div>
      ) : (
        ''
      )}
    </article>
  );
};

export default DescriptionMachine;
