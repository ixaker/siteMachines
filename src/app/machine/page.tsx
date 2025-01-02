"use client";

import ItemGallery from "@/components/item-gallery/ItemGallery";
import { getMachine } from "@/shared/storage";
import { selectAdmin, selectEditor, setAdmin } from "@/store/slice/adminSlice";
import { DataItem } from "@/types/types";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAutorization } from "../auth/utils/auth";
import { AppDispatch } from "@/store/store";
import TitleMachine from "./ui/title-machine/TitleMachine";

const MachinePage = () => {
  const editor = useSelector(selectEditor);
  const [machine, setMachine] = useState<DataItem>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const admin = useSelector(selectAdmin);

  console.log(admin);

  useEffect(() => {
    checkAutorization().then((res) => {
      dispatch(setAdmin(res));
    });
  }, []);

  const id = searchParams.get("id");

  if (!id) {
    router.push("/");
  }

  useEffect(() => {
    const fetchMachine = async () => {
      if (id) {
        try {
          setMachine(await getMachine(id)); // Сохраняем результат в состояние
        } catch (error) {
          console.error("Error fetching machine:", error);
          router.push("/");
        }
      }
    };

    fetchMachine();
  }, [id]);

  const handleTitleChange = (value: string) => {
    setMachine({
      ...machine!,
      data: { ...machine!.data, name: value },
    });
  };

  return (
    <section className="w-full max-w-[1500px] my-10 mx-auto px-4 ">
      <div className="flex gap-10">
        <ItemGallery gallery={machine?.data.gallery || []} />
        <div className="flex flex-1 flex-col gap-10">
          <TitleMachine
            changeFunction={handleTitleChange}
            value={machine?.data.name || ""}
          />

          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">
              1000000 ₴{machine?.data.price}
            </span>
            <span>Код: {machine?.data.article}</span>
          </div>
          <ul className="flex flex-col gap-5">
            <label className="text-2xl font-bold">Характеристики:</label>
            {machine?.data.characteristics.map((item, index) => (
              <li key={index}>
                <span className="font-bold text-[18px]">{item.name}:</span>{" "}
                <span className="text-[18px]">{item.value}</span>
              </li>
            ))}
          </ul>
          <div>
            <button className="text-xl p-3 rounded-full font-medium bg-[#f74936] hover:bg-[#ce4a40] hover:shadow-lg  transition-all duration-300 ease-in-out transform">
              Зателефонувати
            </button>
          </div>
          <ul className="flex justify-center gap-10">
            <li className="flex gap-4">
              <div className="bg-[#f6f6f6] p-3 rounded-lg">
                <LocalShippingIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[#828282]">Безкоштовна Доставка</span>
                <span className="font-medium">1-2 дні</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-[#f6f6f6] p-3 rounded-lg">
                <StoreIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[#828282]">В Наявності</span>
                <span className="font-medium">Сьогодні</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-[#f6f6f6] p-3 rounded-lg">
                <WorkspacePremiumIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[#828282]">Гарантія</span>
                <span className="font-medium">1 рік</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-10 mt-10">
        <article>
          <label className="text-2xl font-bold">Опис</label>
          <p className="text-[18px]">{machine?.data.fullDescription}</p>
        </article>

        <article>
          <label className="text-2xl font-bold">Всі характеристики</label>
          <ul className="flex flex-col gap-5 mt-5">
            {machine?.data.characteristics.map((item, index) => (
              <li key={index}>
                <span className="font-bold text-[18px]">{item.name}:</span>{" "}
                <span className="text-[18px]">{item.value}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};

const MachinePageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MachinePage />
  </Suspense>
);

export default MachinePageWrapper;
