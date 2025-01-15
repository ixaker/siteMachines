import { DataItem } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterParams {
  name?: string;
  article?: string;
  type?: string;
  characteristicsName?: string;
  characteristicsValue?: string;
  [key: string]: string | undefined;
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
    type: '',
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
      state.filterParams = { ...state.filterParams, ...action.payload }; // Обновляем параметры фильтрации
    },
    resetFilter(state) {
      state.filterParams = {}; // Сбрасываем фильтры
    },
  },
});

export const { setData, setFilter, resetFilter } = filterSlice.actions;

// Селектор для получения отфильтрованных данных
export const getFilterData = (state: { filter: FilterData }) => {
  const { data, filterParams } = state.filter;

  return data.filter((item) => {
    // Проверяем имя
    if (filterParams.name && !item.data.name.toLowerCase().includes(filterParams.name.toLowerCase())) {
      return false;
    }

    // Проверяем артикул
    if (filterParams.article && !item.data.article.toLowerCase().includes(filterParams.article.toLowerCase())) {
      return false;
    }

    // Проверяем тип
    if (filterParams.type && item.data.type !== filterParams.type) {
      return false;
    }

    // Проверяем характеристики
    if (
      filterParams.characteristicsName &&
      filterParams.characteristicsValue &&
      item.data.characteristics.some((char) => {
        return (
          char.name.toLowerCase().includes(filterParams.characteristicsName!.toLowerCase()) &&
          char.value.toLowerCase().includes(filterParams.characteristicsValue!.toLowerCase())
        );
      }) === false
    ) {
      return false;
    }

    return true; // Если все условия выполнены
  });
};

export default filterSlice.reducer;
