"use client";

import { getMachine } from "@/shared/storage";
import { DataItem } from "@/types/types";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const MachinePage = () => {
  const [machine, setMachine] = useState<DataItem>();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  return (
    <section className="w-full max-w-[1200px] my-10 mx-auto px-4 ">
      <h1>{machine?.data.name}</h1>
    </section>
  );
};

const MachinePageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MachinePage />
  </Suspense>
);

export default MachinePageWrapper;
