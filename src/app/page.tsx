"use client";

import { fetchData, selectData } from "@/store/slice/dataSlice";
import { AppDispatch } from "@/store/store";
import Image from "next/image";
import { useEffect } from "react";
// import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectData);
  // const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  console.log("data", data);

  return (
    <div>
      <h1>HOME PAGE</h1>

      <ul>
        {data.map((item, index) => (
          <li className="border max-w-fit" key={index}>
            <h3>{item.title}</h3>
            <div className="relative max-w-[500px]  ">
              <Image
                src={item.image}
                width={500}
                height={400}
                alt={`Photo: ${item.title}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
