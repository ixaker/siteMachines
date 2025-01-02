import { checkAutorization } from "@/app/auth/utils/auth";
import {
  selectAdmin,
  selectEditor,
  setAdmin,
  setEditor,
} from "@/store/slice/adminSlice";
import { AppDispatch } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Switch from "@mui/material/Switch";

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const admin = useSelector(selectAdmin);
  const editor = useSelector(selectEditor);

  const handleEditor = () => {
    dispatch(setEditor(!editor));
  };

  useEffect(() => {
    checkAutorization().then((res) => {
      dispatch(setAdmin(res));
    });
  }, [admin]);

  return (
    <section className="flex justify-between">
      <h1>Header</h1>
      <div>
        {admin ? <Switch checked={editor} onChange={handleEditor} /> : ""}
      </div>
    </section>
  );
};

export default Header;
