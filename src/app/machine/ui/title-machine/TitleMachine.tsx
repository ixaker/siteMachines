import { selectEditor } from '@/store/slice/adminSlice';
import { useSelector } from 'react-redux';
import { TitleMachineProps } from './types';
import { selectLoading } from '@/store/slice/dataSlice';
import Skeleton from '@mui/material/Skeleton';

const TitleMachine: React.FC<TitleMachineProps> = ({ value, changeFunction }) => {
  const editor = useSelector(selectEditor);
  const loading = useSelector(selectLoading);

  return (
    <>
      {editor ? (
        <input
          type="text"
          className="text-xl xl:text-3xl font-bold text-start"
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            changeFunction(e.target.value);
          }}
          placeholder="Назва Станку"
        />
      ) : loading ? (
        <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: '36px' }} />
      ) : (
        <h1 className="text-lg sm:text-3xl font-bold text-start">{value || ''}</h1>
      )}
    </>
  );
};

export default TitleMachine;
