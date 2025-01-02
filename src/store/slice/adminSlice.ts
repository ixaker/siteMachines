import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface AdminState {
  admin: boolean;
  editor: boolean;
  token: string;
  error: string | null;
}

const getToken = (): string => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem("token") || '';
  }
  return '';
};

const initialState: AdminState = {
  admin: false,
  editor: false,
  token: getToken(),
  error: null,
};

// Асинхронная операция для логина
export const login = createAsyncThunk<boolean, string>(
  "admin/login",
  async (password: string) => {
    try {
      const response = await axios.get(
        `https://machines.qpart.com.ua/auth.php?password=${password}`
      );

      if (response.status === 200) {
        const token = response.headers["x-auth-token"]; // Получение токена
        window.localStorage.setItem("token", token); // Сохранение токена в localStorage
        return true; // Успешный вход
      } else {
        console.error("Unexpected response status:", response.status);
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error message:", error.message);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        if (error.response?.status === 401) {
          alert("Unauthorized: Invalid password.");
        } else if (error.response?.status === 500) {
          alert("Server error: Please try again later.");
        } else {
          alert("An error occurred. Please try again.");
        }
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong. Please try again.");
      }
      return false; // Ошибка входа
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = false;
      state.editor = false;
      state.token = "" ;
      window.localStorage.removeItem("token");
      state.error = null;
    },
    setAdmin: (state, action: { payload: boolean }) => {
      state.admin = action.payload; // Устанавливаем новое значение admin
    },
    setEditor: (state, action: { payload: boolean }) => {
      state.editor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null; // Очистка ошибки при новом запросе
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload) {
          state.admin = true; // Вход успешен
          state.token = "some-token"; // Можно вернуть токен, если он есть
          state.error = null;
        } else {
          state.admin = false; // Вход не удался
          state.error = "Invalid password"; // Пример обработки ошибки
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.admin = false;
        state.error = action.error.message || "Login failed"; // Обработка ошибки
      });
  },
});

export const { logout, setAdmin, setEditor } = adminSlice.actions;
export const selectAdmin = (state: { admin: AdminState }) => state.admin.admin;
export const selectEditor = (state: { admin: AdminState }) =>
  state.admin.editor;
export const selectError = (state: { admin: AdminState }) => state.admin.error;
export default adminSlice.reducer;
