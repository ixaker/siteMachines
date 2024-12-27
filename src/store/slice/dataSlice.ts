import { firestore } from "@/firebase-config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";

export const fetchData = createAsyncThunk<
  DataItem[],
  void,
  { rejectValue: string }
>("data/fetchData", async (_, { rejectWithValue }) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "machines"));

    const data = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        fullDescription: data.fullDescription || "",
        image: data.image || "",
        price: data.price || 0,
        characteristics: data.characteristics || [],
      };
    });

    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return rejectWithValue("Failed to fetch data"); // Отправляем ошибку, если что-то пошло не так
  }
});

// Тип данных для одного элемента
interface DataItem {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  price: number;
  characteristics: { name: string; value: string }[];
}

// Тип состояния
interface DataState {
  items: DataItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

// Селекторы для доступа к данным
export const selectData = (state: { data: DataState }) => state.data.items;
export const selectLoading = (state: { data: DataState }) => state.data.loading;

export default dataSlice.reducer;
