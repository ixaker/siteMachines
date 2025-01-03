import { DataItem } from "@/types/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://machines.qpart.com.ua/storage.php";
// Тип состояния
interface DataState {
  data: DataItem[];
  loading: boolean;
  error: string | null;
  filter: string;
}

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
  filter: "",
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

export const deleteMachine = createAsyncThunk<string, string>(
  "data/deleteMachine",
  async (id) => {
    try {
      // Используем DELETE-запрос с параметром id
      const response = await axios.delete(`${API_URL}?id=${id}`);

      // Убедимся, что сервер подтвердил удаление, вернем id
      if (response.status === 200) {
        return id;
      } else {
        throw new Error("Failed to delete machine");
      }
    } catch (error) {
      console.error("Error deleting machine:", error);
      throw error;
    }
  }
);

export const selectFilteredData = (state: { data: DataState }) => {
  const { data, filter } = state.data;
  if (!filter) return data;
  return data.filter((item) =>
    item.data.name.toLowerCase().includes(filter.toLowerCase())
  );
};

const dataSlice = createSlice({
  name: "data",
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
        state.error = action.error.message || "Failed to fetch data";
      })
      .addCase(
        addMachine.fulfilled,
        (state, action: PayloadAction<DataItem>) => {
          state.loading = false;
          state.data.push(action.payload);
        }
      )
      .addCase(deleteMachine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.loading = false;
        // Удаляем элемент с указанным id из списка
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete machine";
      });
  },
});

// Селекторы для доступа к данным
export const { setFilter } = dataSlice.actions;
export const selectData = (state: { data: DataState }) => state.data.data;
export const selectLoading = (state: { data: DataState }) => state.data.loading;

export default dataSlice.reducer;
