import { DataItem } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterParams {
  name?: string;
  article?: string;
  type?: string[];
  characteristics?: { name: string; value: string }[];
}

interface FilterData {
  data: DataItem[];
  filterParams: FilterParams;
}

const initialState: FilterData = {
  data: [],
  filterParams: {
    name: '',
    article: '',
    type: [],
    characteristics: [],
  },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<DataItem[]>) {
      state.data = action.payload; // Устанавливаем данные для фильтрации
    },
    setFilter(state, action: PayloadAction<FilterParams>) {
      state.filterParams = { ...state.filterParams, ...action.payload };
    },
    resetFilter(state) {
      state.filterParams = {}; // Сбрасываем фильтры
    },
  },
});

// Селектор для получения отфильтрованных данных
export const getFilterData = (state: { filter: FilterData }) => {
  const { data, filterParams } = state.filter;
  return data.filter((item) => {
    // Фильтр по типу
    let result = false;
    if (filterParams.type !== undefined) {
      if (filterParams.type?.length > 0) {
        filterParams.type?.forEach((filterItem) => {
          if (filterItem === item.data.type) {
            result = true;
            return;
          }
        });
      } else {
        result = true;
      }
    } else {
      result = true;
    }
    // if (filterParams.type && item.data.type !== filterParams.type) {
    //   return false;
    // }

    // Фильтр по характеристикам
    // if (filterParams.characteristics && filterParams.characteristics.length > 0) {
    //   const match = filterParams.characteristics.every((filterChar) => {
    //     return item.data.characteristics.some((itemChar: Characteristic) => {
    //       return (
    //         itemChar.name.toLowerCase().includes(filterChar.name.toLowerCase()) &&
    //         itemChar.value.toLowerCase().includes(filterChar.value.toLowerCase())
    //       );
    //     });
    //   });
    //   if (!match) {
    //     return false;
    //   }
    // }

    return result; // Все условия выполнены
  });
};
export const { setData, setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
