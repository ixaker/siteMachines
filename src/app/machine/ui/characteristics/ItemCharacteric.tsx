import { Characteristic } from '@/types/types';
import { Checkbox } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface ItemCharactericProps {
  id: string;
  index: number;
  item: Characteristic;
  handleNameChange: (index: number, newName: string) => void;
  handleValueChange: (index: number, newValue: string) => void;
  handleInViewChange: (index: number, checked: boolean) => void;
  removeCharacteristic: (index: number) => void;
}

const ItemCharacteric: React.FC<ItemCharactericProps> = ({
  handleInViewChange,
  handleNameChange,
  handleValueChange,
  id,
  index,
  item,
  removeCharacteristic,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ccc',
    background: 'lightgray',
    cursor: 'move',
    position: 'relative', // Сделать элементы фиксированными относительно их контейнера
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, // Обновляем стиль при перетаскивании
    transition: transition || 'none', // Добавляем плавный переход
  };

  return (
    <li ref={setNodeRef} {...listeners} {...attributes} style={style} className="flex items-center gap-4" key={index}>
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
      <Checkbox checked={item.viewInCard} onChange={(e) => handleInViewChange(index, e.target.checked)} />
      <button onClick={() => removeCharacteristic(index)} className="text-red-500 font-bold">
        Удалить
      </button>

      <DragIndicatorIcon />
    </li>
  );
};

export default ItemCharacteric;
