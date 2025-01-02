import { selectEditor } from "@/store/slice/adminSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { TitleMachineProps } from "./types"; // Исправлено: "trpes" на "types"
import { selectLoading } from "@/store/slice/dataSlice";
import Skeleton from "@mui/material/Skeleton";

const TitleMachine: React.FC<TitleMachineProps> = ({
  value,
  changeFunction,
}) => {
  const editor = useSelector(selectEditor);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

  return (
    <>
      {editor ? (
        <input
          type="text"
          className="text-3xl font-bold text-center"
          value={value || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            changeFunction(e.target.value);
          }}
        />
      ) : loading ? (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "36px" }}
        />
      ) : (
        <h1 className="text-3xl font-bold text-center">{value || ""}</h1>
      )}
    </>
  );
};

export default TitleMachine;
