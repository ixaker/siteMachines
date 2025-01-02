"use client";
import {
  login,
  logout,
  selectAdmin,
  selectError,
} from "@/store/slice/adminSlice";
import { AppDispatch } from "@/store/store";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Auth = () => {
  const dispatch: AppDispatch = useDispatch();
  const [password, setPassword] = useState("");
  const admin = useSelector(selectAdmin);
  const error = useSelector(selectError);

  const handleLogin = () => {
    dispatch(login(password)); // Вызов асинхронной операции login
  };

  const handleLogout = () => {
    dispatch(logout()); // Выход
  };

  return (
    <section className="relative flex justify-center items-center h-screen">
      <div className="w-screen h-screen absolute z-0 top-0 left-0 bg-[#0000004f]"></div>
      {!admin ? (
        <div className="relative z-10 bg-white p-10 flex flex-col gap-10 max-w-[500px]">
          <TextField
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
          {error && <p>{error}</p>}
        </div>
      ) : (
        <div className="relative z-10 bg-white p-10 flex flex-col gap-10 max-w-[500px]">
          <p>Welcome, Admin!</p>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </section>
  );
};

export default Auth;
