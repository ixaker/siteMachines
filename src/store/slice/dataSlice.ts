import { DataItem } from "@/types/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'https://machines.qpart.com.ua/storage.php';
// Тип состояния
interface DataState {
  data: DataItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
};


export const fetchMachine = createAsyncThunk<DataItem[]>("data/fetchMachine", async()=> {
  const response = await axios.get<DataItem[]>(API_URL);
  return response.data;
})

export const addMachine = createAsyncThunk<DataItem, DataItem>(
  "data/addMachine",
  async (newMachine) => {
    try {
      const requestData = new URLSearchParams({
        data: JSON.stringify(newMachine),
      }).toString();

      const response = await axios.post<DataItem>(
        "https://site.qpart.com.ua/storage.php",
        requestData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding machine:");
      throw error;
    }
  }
);



const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachine.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMachine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      })
      .addCase(addMachine.fulfilled, (state) => {
        state.loading = false;
      })
  },
  },
);

// Селекторы для доступа к данным
export const selectData = (state: { data: DataState }) => state.data.data;
export const selectLoading = (state: { data: DataState }) => state.data.loading;

export default dataSlice.reducer;
