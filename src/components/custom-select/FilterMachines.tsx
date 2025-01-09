import SaveIcon from '@mui/icons-material/Save';
import ApiClient, { Type } from '@/store/slice/db';
import { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, IconButton, Skeleton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { selectEditor, selectToken } from '@/store/slice/adminSlice';
import { useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function FilterMachines() {
  const [types, setTypes] = useState<Type[]>([]);
  const [disabledButtonSave, setDisabledButtonSave] = useState<boolean>(true);
  const [filter, setFilter] = useState<string[]>([]);
  console.log(filter);

  const editor = useSelector(selectEditor);

  const token = useSelector(selectToken);
  const api = new ApiClient('https://machines.qpart.com.ua/', token);

  useEffect(() => {
    api
      .getTypes()
      .then((res) => setTypes(res))
      .catch(console.error);
  }, []);

  const changeValInput = (index: number, newVal: string) => {
    setDisabledButtonSave(false);
    const newTypes = [...types];
    newTypes[index].name = newVal;
    setTypes(newTypes);
  };

  const handleClickDelete = (index: number) => {
    setDisabledButtonSave(false);
    if (types[index].id !== '0') {
      api.deleteType(types[index].id);
    }
    const newTypes = types.filter((_, i) => i !== index);
    setTypes(newTypes);
  };

  const handleClickAdd = () => {
    setTypes((prev) => [...prev, ...[{ name: '', id: '0', characteristics: [] }]]);
  };

  const handleClickSave = () => {
    types.map((item) => {
      if (item.id === '0') {
        if (item.name.length > 0) {
          api.createType(item.name);
        }
      } else {
        if (item.name.length > 0) {
          if (item.characteristics === null) {
            item.characteristics = [];
          }
          api.updateType(item.id, item.name, item.characteristics);
        } else {
          api.deleteType(item.id);
        }
      }
    });
  };

  return (
    <div className="pr-4 w-auto hidden md:block">
      <span className="font-bold text-[20px]">Тип верстата:</span>
      <FormGroup>
        {editor ? (
          <>
            {types.map((item, index) => (
              <div key={index} className="w-full flex">
                <TextField
                  sx={{ width: '100%' }}
                  variant="standard"
                  placeholder="Назва типу"
                  value={item.name}
                  onChange={(e) => changeValInput(index, e.target.value)}
                />
                <IconButton onClick={() => handleClickDelete(index)}>
                  {' '}
                  <ClearIcon />
                </IconButton>
              </div>
            ))}
            <div className="flex justify-end ">
              <IconButton color="primary" onClick={handleClickAdd}>
                <AddCircleOutlineIcon sx={{ fontSize: '35px' }} />
              </IconButton>{' '}
              <IconButton color="primary" disabled={disabledButtonSave} onClick={handleClickSave}>
                <SaveIcon sx={{ fontSize: '35px' }} />
              </IconButton>
            </div>
          </>
        ) : (
          <>
            {' '}
            {types.map((item, index) =>
              types.length < 0 ? (
                <>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </>
              ) : (
                <>
                  <div key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const value = e.target.value;
                            setFilter((prev) => (isChecked ? [...prev, value] : prev.filter((item) => item !== value)));
                          }}
                          value={item.id}
                        />
                      }
                      label={item.name}
                    />
                  </div>
                </>
              )
            )}
          </>
        )}
      </FormGroup>
    </div>
  );
}
