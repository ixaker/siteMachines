import dotenv from 'dotenv';

import { DataItem, GalleryItem } from '@/types/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { EMPTY_DATA_ITEM } from '@/app/constants/dataConstants';
import { resizeImage } from '@/utils/resizeImage';
dotenv.config();

// const API_URL = 'https://machines.qpart.com.ua/storage.php';

const API_URL = 'https://site.qpart.com.ua/storage.php';
console.log(process.env.ENV_BASE_URL);

interface DataState {
  emptyDataItem: DataItem;
  data: DataItem[];
  loading: boolean;
  error: string | null;
  filter: string;
}

const initialState: DataState = {
  emptyDataItem: EMPTY_DATA_ITEM,
  data: [],
  loading: false,
  error: null,
  filter: '',
};

export const fetchMachines = createAsyncThunk<DataItem[]>('data/fetchMachines', async () => {
  const response = await axios.get(API_URL);
  const list = response.data.list;

  list.forEach((element: { id: string; data: string }) => {
    element.data = JSON.parse(element.data);
  });

  return list;
});

export const addMachine = createAsyncThunk<DataItem, void, { state: RootState }>(
  'data/addMachine',
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.admin.token;

      if (!token) {
        throw new Error('Unauthorized: Token is missing');
      }

      const data = JSON.stringify(initialState.emptyDataItem.data);
      const formData = new FormData();
      formData.append('data', data);

      const response = await axios.post<DataItem>(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding machine:');
      throw error;
    }
  }
);

export const deleteMachine = createAsyncThunk<string, string>('data/deleteMachine', async (id) => {
  try {
    // Используем DELETE-запрос с параметром id
    const response = await axios.delete(`${API_URL}?id=${id}`);

    // Убедимся, что сервер подтвердил удаление, вернем id
    if (response.status === 200) {
      return id;
    } else {
      throw new Error('Failed to delete machine');
    }
  } catch (error) {
    console.error('Error deleting machine:', error);
    throw error;
  }
});

export const selectFilteredData = (state: { data: DataState }) => {
  const { data, filter } = state.data;
  if (!filter) return data;
  return data.filter((item) => item.data.name.toLowerCase().includes(filter.toLowerCase()));
};

export const updateMachine = createAsyncThunk<
  DataItem,
  { id: string; updatedData: DataItem['data']; files: File[] },
  { state: RootState }
>('data/updateMachine', async ({ id, updatedData, files }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.admin.token;

    if (!token) {
      throw new Error('Unauthorized: Token is missing');
    }

    const version = Date.now().toString();
    const formData = new FormData();
    formData.append('id', id);

    updatedData.gallery = [];
    updatedData.galleryMin = [];

    // Асинхронная обработка файлов с использованием Promise.all
    await Promise.all(
      files.map(async (file, index) => {
        // Добавляем оригинальный файл
        formData.append(`file${index}`, file);

        const fileItem: GalleryItem = {
          type: file.type,
          src: `https://a7b85a942d4082eb.cdn.express/machines/${id}/${file.name}?v=${version}`,
          name: file.name,
        };
        updatedData.gallery.push(fileItem);

        // Ресайз изображения
        const resizedFile = await resizeImage(file, 350, 200);
        formData.append(`fileMin${index}`, resizedFile);

        const fileMinItem: GalleryItem = {
          type: resizedFile.type,
          src: `https://a7b85a942d4082eb.cdn.express/machines/${id}/${resizedFile.name}?v=${version}`,
          name: resizedFile.name,
        };
        updatedData.galleryMin.push(fileMinItem);
      })
    );

    // Добавляем обновленные данные
    formData.append('data', JSON.stringify(updatedData));

    // Отправляем запрос на сервер
    const response = await axios.post<DataItem>(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating machine:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios error message:', error.message);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);

      return rejectWithValue(error.response?.data || 'An error occurred while updating the machine');
    }

    return rejectWithValue('Unexpected error occurred');
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      })
      .addCase(addMachine.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((item) => item.id !== action.payload);
      });
    builder
      .addCase(updateMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMachine.fulfilled, (state, action: PayloadAction<DataItem>) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete machine';
      });
  },
});

// Селекторы для доступа к данным
export const { setFilter } = dataSlice.actions;
export const selectData = (state: { data: DataState }) => state.data.data;
export const selectLoading = (state: { data: DataState }) => state.data.loading;

export default dataSlice.reducer;
