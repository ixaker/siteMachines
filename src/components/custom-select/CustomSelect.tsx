import SaveIcon from '@mui/icons-material/Save';
import ApiClient, { Type } from '@/store/slice/db';
import { ChangeEvent, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { selectEditor } from '@/store/slice/adminSlice';
import { useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const api = new ApiClient('https://machines.qpart.com.ua/');

export default function CustomSelect() {
  const [types, setTypes] = useState<Type[]>([]);
  const [disabledButtonSave, setDisabledButtonSave] = useState<boolean>(true);
  const editor = useSelector(selectEditor);

  useEffect(() => {
    console.log('types', types);
  }, [types.length]);

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
    api.deleteType(types[index].id);
    const newTypes = types.filter((_, i) => i !== index);
    setTypes(newTypes);
  };

  const handleClickAdd = () => {
    setTypes((prev) => [...prev, ...[{ name: '', id: 0 }]]);
  };

  const handleClickSave = () => {
    types.map((item) => {
      if (item.id === 0) {
        if (item.name.length > 0) {
          api.createType(item.name);
        }
      } else {
        if (item.name.length > 0) {
          api.updateType(item.id, item.name);
        } else {
          api.deleteType(item.id);
        }
      }
    });
  };

  return (
    <div>
      <span className="font-bold text-[20px]">Тип верстата:</span>
      <FormGroup>
        {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Label" /> */}

        {editor ? (
          <>
            {types.map((item, index) => (
              <div key={index}>
                <TextField
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
            <div className="flex justify-start">
              <IconButton onClick={handleClickAdd}>
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton disabled={disabledButtonSave} onClick={handleClickSave}>
                <SaveIcon />
              </IconButton>
            </div>
          </>
        ) : (
          <>
            {' '}
            {types.map((item, index) => (
              <div key={index}>
                <FormControlLabel control={<Checkbox />} label={item.name} />
              </div>
            ))}
          </>
        )}
      </FormGroup>
    </div>
  );
}
