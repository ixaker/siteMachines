import { selectEditor } from '@/store/slice/adminSlice';
import { selectLoading } from '@/store/slice/dataSlice';
import { useSelector } from 'react-redux';
import { TitleMachineProps } from '../title-machine/types';
import { Skeleton } from '@mui/material';

const PriceMachine: React.FC<TitleMachineProps> = ({ value, changeFunction }) => {
  const editor = useSelector(selectEditor);
  const loading = useSelector(selectLoading);

  return (
    <>
      {editor ? (
        <input
          placeholder="Ціна в ГРН"
          type="number"
          className="text-3xl font-bold"
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            changeFunction(e.target.value);
          }}
        />
      ) : loading ? (
        <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: '36px' }} />
      ) : (
        <span className="text-xl sm:text-3xl font-bold ">{value || ''}$</span>
      )}
    </>
  );
};

export default PriceMachine;
