import { selectEditor } from '@/store/slice/adminSlice';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface EditableCharacteristicsProps {
  characteristics: { name: string; value: string }[];
  onChange: (updatedCharacteristics: { name: string; value: string }[]) => void;
}

const EditableCharacteristics: React.FC<EditableCharacteristicsProps> = ({ characteristics, onChange }) => {
  const [localCharacteristics, setLocalCharacteristics] = useState(characteristics);
  const editor = useSelector(selectEditor);

  useEffect(() => {
    setLocalCharacteristics(characteristics);
  }, [characteristics]);

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...localCharacteristics];
    updated[index].name = newName;
    setLocalCharacteristics(updated);
    onChange(updated);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...localCharacteristics];
    updated[index].value = newValue;
    setLocalCharacteristics(updated);
    onChange(updated);
  };

  const addCharacteristic = () => {
    const updated = [...localCharacteristics, { name: '', value: '' }];
    setLocalCharacteristics(updated);
    onChange(updated);
  };

  const removeCharacteristic = (index: number) => {
    const updated = localCharacteristics.filter((_, i) => i !== index);
    setLocalCharacteristics(updated);
    onChange(updated);
  };

  return (
    <div>
      {editor ? (
        <>
          <label className="text-2xl font-bold">Редактировать характеристики</label>
          <ul className="flex flex-col gap-4 mt-4">
            {localCharacteristics.map((item, index) => (
              <li key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Название"
                  value={item.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="text"
                  placeholder="Значение"
                  value={item.value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <button onClick={() => removeCharacteristic(index)} className="text-red-500 font-bold">
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <button onClick={addCharacteristic} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Добавить характеристику
          </button>
        </>
      ) : (
        <>
          <ul className="flex flex-col gap-5">
            <label className="text-2xl font-bold">Характеристики:</label>
            {characteristics.map((item, index) => (
              <li className="max-w-[400px] flex justify-between" key={index}>
                <span className="font-bold text-[18px]">{item.name}:</span>{' '}
                <span className="text-[18px]">{item.value}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EditableCharacteristics;
