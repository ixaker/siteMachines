import { DataItem } from '@/types/types';
import axios from 'axios';

export const getMachine = async (id: string | null): Promise<DataItem> => {
  const response = await axios.get(`https://machines.qpart.com.ua/storage.php?id=${id}`);

  const machine = response.data;
  if (!machine) {
    throw new Error('Machine not found');
  }
  machine.data = JSON.parse(machine.data);

  const result: DataItem = machine;
  return result;
};
