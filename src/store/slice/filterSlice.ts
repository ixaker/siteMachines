import { DataItem } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterParams {
  name?: string;
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
    type: '',
    price: '',
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
      state.filterParams = {};
    },
  },
});

export const { setData, setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
