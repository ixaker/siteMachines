import { selectEditor } from '@/store/slice/adminSlice';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ItemCharacteric from './ItemCharacteric';
import BuildIcon from '@mui/icons-material/Build';

interface EditableCharacteristicsProps {
  characteristics: { name: string; value: string; viewInCard: boolean }[];
  onChange: (updatedCharacteristics: { name: string; value: string; viewInCard: boolean }[]) => void;
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

  const handleInViewChange = (index: number, newValue: boolean) => {
    const updated = [...localCharacteristics];
    updated[index].viewInCard = newValue;
    setLocalCharacteristics(updated);
    onChange(updated);
  };

  const addCharacteristic = () => {
    const updated = [...localCharacteristics, { name: '', value: '', viewInCard: false }];
    setLocalCharacteristics(updated);
    onChange(updated);
  };

  const removeCharacteristic = (index: number) => {
    const updated = localCharacteristics.filter((_, i) => i !== index);
    setLocalCharacteristics(updated);
    onChange(updated);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = localCharacteristics.findIndex(
        (item, index) => `${item.name}${item.value}${index}` === active.id
      );
      const overIndex = localCharacteristics.findIndex(
        (item, index) => `${item.name}${item.value}${index}` === over.id
      );
      const reorderedItems = arrayMove(localCharacteristics, activeIndex, overIndex);
      setLocalCharacteristics(reorderedItems);
      onChange(reorderedItems);
    }
  };

  return (
    <div>
      {editor ? (
        <>
          <label className="text-2xl font-bold">Редактировать характеристики</label>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={localCharacteristics.map((item, index) => `${item.name}${item.value}${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-4">
                {localCharacteristics.map((item, index) => (
                  <ItemCharacteric
                    key={index}
                    index={index}
                    id={`${item.name}${item.value}${index}`}
                    item={item}
                    handleNameChange={handleNameChange}
                    handleValueChange={handleValueChange}
                    handleInViewChange={handleInViewChange}
                    removeCharacteristic={removeCharacteristic}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <button onClick={addCharacteristic} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Добавить характеристику
          </button>
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold text-gray-800 mb-3 w-full text-start">Характеристика верстата:</p>
          <ul className="flex flex-col  gap-4 mt-5 w-full">
            {localCharacteristics.map(
              (item, index) =>
                item.viewInCard && (
                  <li
                    key={index}
                    className="w-[75%] flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-all ease-in-out duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <BuildIcon className="text-gray-600" />
                      <span className="font-medium text-lg text-gray-800">{item.name}:</span>
                    </div>
                    <span className="text-lg text-gray-600">{item.value}</span>
                  </li>
                )
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default EditableCharacteristics;
