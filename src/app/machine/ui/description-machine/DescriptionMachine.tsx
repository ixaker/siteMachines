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
    <article className="flex flex-col">
      <label className="text-2xl font-bold">Опис</label>
      {editor ? (
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            changeFunction(e.target.value);
          }}
          value={description}
          type="text"
          className="text-[18px] mt-5"
          placeholder="Опис Станку"
        />
      ) : (
        <p className="text-[18px] mt-5">{description}</p>
      )}
    </article>
  );
};

export default DescriptionMachine;
