"use client";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const Auth = () => {
  const [password, setPassword] = useState("");

  const logIn = async () => {
    console.log("window.auth", auth);

    try {
      const response = await axios.get(
        `https://machines.qpart.com.ua/auth.php?password=${password}`
      );

      setPassword("");

      if (response.status === 200) {
        return true; // Успешный вход
      } else {
        console.error("Unexpected response status:", response.status);
        return false;
      }
    } catch (error) {
      // Проверка, является ли ошибка экземпляром AxiosError
      if (axios.isAxiosError(error)) {
        console.error("Axios error message:", error.message);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        // Обработка различных кодов ошибок
        if (error.response?.status === 401) {
          alert("Unauthorized: Invalid password.");
        } else if (error.response?.status === 500) {
          alert("Server error: Please try again later.");
        } else {
          alert("An error occurred. Please try again.");
        }
      } else {
        // Если ошибка не связана с Axios
        console.error("Unexpected error:", error);
        alert("Something went wrong. Please try again.");
      }

      return false; // Ошибка входа
    }
  };

  return (
    <section className="w-screen h-screen flex items-center justify-center relative">
      <div className="w-screen h-screen absolute z-0 top-0 left-0 bg-[#0000004f]"></div>
      <div className="relative z-10 bg-white p-10 flex flex-col gap-10">
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={logIn} variant="contained">
          LogIn
        </Button>
      </div>
    </section>
  );
};

export default Auth;
