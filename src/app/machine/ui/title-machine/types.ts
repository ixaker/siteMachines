// import { DataItem } from "@/types/types";

export interface TitleMachineProps {
  value: string | number;
  changeFunction: (value: string) => void;
}

export interface BreadcrumbProps {
  type: string;
  model: string;
  changeFunction: (key: string, value: string) => void;
}
