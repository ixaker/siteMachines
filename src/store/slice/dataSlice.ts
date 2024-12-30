import { DataItem } from "@/types/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://machines.qpart.com.ua/storage.php";
// Тип состояния
interface DataState {
  data: DataItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  data: [] as DataItem[],
  loading: false,
  error: null,
};

export const fetchMachines = createAsyncThunk<DataItem[]>(
  "data/fetchMachines",
  async () => {
    const response = await axios.get(API_URL);
    const list = response.data.list;

    list.forEach((element: { id: string; data: string }) => {
      element.data = JSON.parse(element.data);
    });

    return list;
  }
);

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

// export const getMachine = async (id: string | null): Promise<DataItem> => {
//   const response = await axios.get(
//     `https://machines.qpart.com.ua/storage.php?id=${id}`
//   );

//   const machine = response.data;
//   if (!machine) {
//     throw new Error("Machine not found");
//   }
//   machine.data = JSON.parse(machine.data);

//   const result: DataItem = machine;
//   return result;
// };

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
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
        state.error = action.error.message || "Failed to fetch data";
      })
      .addCase(
        addMachine.fulfilled,
        (state, action: PayloadAction<DataItem>) => {
          state.loading = false;
          state.data.push(action.payload);
        }
      );
  },
});

// Селекторы для доступа к данным
export const selectData = (state: { data: DataState }) => state.data.data;
export const selectLoading = (state: { data: DataState }) => state.data.loading;

export default dataSlice.reducer;
