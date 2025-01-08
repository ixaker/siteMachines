import { DataItem } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterParams {
  name?: string;
  type?: string;
  characteristicsName?: string;
  characteristicsValue?: string;
  [key: string]: string | undefined; // Для расширяемости
}

interface FilterData {
  data: DataItem[];
  filterParams: FilterParams;
}

const initialState: FilterData = {
  data: [],
  filterParams: {
    name: '',
    type: '',
    characteristicsName: '',
    characteristicsValue: '',
  },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<DataItem[]>) {
      state.data = action.payload;
    },
    setFilter(state, action: PayloadAction<FilterParams>) {
      state.filterParams = { ...state.filterParams, ...action.payload };
    },
    resetFilter(state) {
      state.filterParams = {}; // Сброс всех фильтров
    },
  },
});

export const selectAllData = (state: { filter: FilterData }) => {
  return state.filter?.data; // Просто возвращаем все данные без фильтрации
};

// Обновленная функция фильтрации с проверками на undefined
export const selectFilteredData = (state: { filter: FilterData }) => {
  const { data, filterParams } = state.filter;

  return data.filter((item) => {
    // Фильтрация по основным полям
    const matchesName = !filterParams.name || item.data.name.toLowerCase().includes(filterParams.name.toLowerCase());
    const matchesType = !filterParams.type || item.data.type.toLowerCase().includes(filterParams.type.toLowerCase());

    // Фильтрация по характеристикам
    const matchesCharacteristics =
      !filterParams.characteristicsName ||
      item.data.characteristics.some(
        (characteristic) =>
          characteristic.name.toLowerCase().includes(filterParams.characteristicsName?.toLowerCase() || '') &&
          (!filterParams.characteristicsValue ||
            characteristic.value.toLowerCase().includes(filterParams.characteristicsValue?.toLowerCase() || ''))
      );

    // Возвращаем результат фильтрации
    return matchesName && matchesType && matchesCharacteristics;
  });
};

// Экспортируем экшены и редьюсер
export const { setData, setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
