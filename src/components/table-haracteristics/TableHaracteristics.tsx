import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { selectEditor, selectToken } from '@/store/slice/adminSlice';
import { useSelector } from 'react-redux';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ItemCharacteric from '@/app/machine/ui/characteristics/ItemCharacteric';
import { useEffect, useState } from 'react';
import ApiClient from '@/store/slice/db';
import { DataItem } from '@/types/types';

interface TableHaracteristicsProps {
  machine: DataItem;
  currenTypeName: string;
  onChange: (updatedCharacteristics: { name: string; value: string; viewInCard: boolean }[]) => void;
  characteristics: { name: string; value: string; viewInCard: boolean }[];
}

const TableHaracteristics: React.FC<TableHaracteristicsProps> = ({
  characteristics,
  onChange,
  currenTypeName,
  machine,
}) => {
  const token = useSelector(selectToken);
  const api = new ApiClient(token);

  const [localCharacteristics, setLocalCharacteristics] = useState(characteristics);
  useEffect(() => {
    setLocalCharacteristics(characteristics);
  }, [characteristics]);

  const editor = useSelector(selectEditor);

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

  const saveCharacteristicsForType = () => {
    const characteristics: string[] = [];

    localCharacteristics.forEach((item) => {
      characteristics.push(item.name);
    });

    api.updateType(machine.data.type, currenTypeName, characteristics);
  };

  return (
    <section>
      {editor ? (
        <div className="max-w-[800px]">
          {' '}
          <label className="text-lg sm:text-2xl font-bold">Редактировать характеристики</label>
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
          <div className="flex gap-4">
            <button onClick={addCharacteristic} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Добавить характеристику
            </button>
            <button onClick={saveCharacteristicsForType} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Зберегти харктеристики для типу
            </button>
          </div>
        </div>
      ) : (
        <>
          {' '}
          <label className="text-lg sm:text-2xl font-bold">Всі характеристики</label>
          <TableContainer component={Paper} className="mt-5 max-w-[800px]">
            <Table sx={{ backgroundColor: '#f9f9f9' }} aria-label="simple table">
              <TableBody>
                {characteristics.map((row) => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </section>
  );
};

export default TableHaracteristics;
