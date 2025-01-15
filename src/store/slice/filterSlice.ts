import { DataItem } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

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
export const getFilterData = createSelector(
  (state: { filter: FilterData }) => state.filter,
  (filterData) => {
    const { data, filterParams } = filterData;

    return data.filter((item) => {
      let result = false;

      if (filterParams.type !== undefined) {
        if (filterParams.type.length > 0) {
          filterParams.type.forEach((filterItem) => {
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

      return result;
    });
  }
);

export const { setData, setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
