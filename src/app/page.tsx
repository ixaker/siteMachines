"use client";

import ListCard from "@/components/list-card/ListCard";
import { useEffect } from "react";
import { checkAutorization } from "./auth/utils/auth";
import { selectAdmin, setAdmin } from "@/store/slice/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";

const Home = () => {
  const admin = useSelector(selectAdmin);
  const dispatch: AppDispatch = useDispatch();

  console.log(admin);

  useEffect(() => {
    checkAutorization().then((res) => {
      dispatch(setAdmin(res));
    });
  }, []);

  return (
    <div className="mt-10">
      <ListCard />
    </div>
  );
};

export default Home;
