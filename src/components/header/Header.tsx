import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import {
  logout,
  selectAdmin,
  selectEditor,
  setEditor,
} from "@/store/slice/adminSlice";
import { AppDispatch } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import { IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { setFilter } from "@/store/slice/dataSlice";

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const admin = useSelector(selectAdmin);
  const editor = useSelector(selectEditor);
  const [filter, setFilterValue] = useState("");

  const handleEditor = () => {
    dispatch(setEditor(!editor));
  };

  console.log("admin", admin);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value); // Обновляем локальное состояние
    dispatch(setFilter(value)); // Обновляем фильтр в Redux
  };

  return (
    <header className="flex flex-col w-full max-w-[1500px] mt-10 my-0 mx-auto px-4 bg-inherit">
      <div className="flex items-center justify-end gap-5">
        {admin ? <Switch checked={editor} onChange={handleEditor} /> : ""}
        {admin ? (
          <IconButton onClick={() => dispatch(logout())} size="medium">
            <LogoutIcon sx={{ color: "black" }} />
          </IconButton>
        ) : (
          ""
        )}
      </div>
      <div className="flex items-center justify-between gap-5">
        <Link href="/">
          <Image alt="Logo" src="/logo.webp" width={44} height={44} />
        </Link>
        <div className="flex flex-1 items-center w-[500px] border-2 border-[#76767a] rounded-full p-2 shadow-sm">
          <input
            value={filter}
            onChange={handleFilterChange}
            type="text"
            placeholder="Фрезерний верстат з ЧПК Vector 0906F Z150"
            className="border-none focus:outline-none focus:ring-inherit rounded-lg w-full"
          />
          <SearchIcon className="ml-2" />
        </div>
        <ul className="flex gap-5">
          <li className="text-2xl text-[#373435] font-bold">
            <a href="#">Контакти</a>
          </li>
          <li className="text-2xl text-[#373435] font-bold">
            <a href="#">Про компанію</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;