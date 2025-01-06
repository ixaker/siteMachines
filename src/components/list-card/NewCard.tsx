import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addMachine } from '@/store/slice/dataSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';

const NewCard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const addNewMachine = async () => {
    try {
      const result = await dispatch(addMachine()).unwrap();
      const newId = result.id;

      router.push(`/machine/?id=${newId}`);
    } catch (error) {
      console.error('Failed to add machine:', error);
    }
  };

  return (
    <div className="max-w-[350px] relative bg-white shadow-md rounded-lg group cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out">
      <IconButton onClick={addNewMachine} sx={{ padding: '20px' }}>
        <AddCircleOutlineIcon sx={{ fontSize: '80px' }} />
      </IconButton>
    </div>
  );
};

export default NewCard;
