"use client";

import ListCard from "@/components/list-card/ListCard";
import { checkAutorixation } from "./auth/utils/auth";

export default function Home() {
  checkAutorixation();
  return (
    <div className="mt-10">
      <ListCard />
    </div>
  );
}
