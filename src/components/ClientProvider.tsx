"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import Header from "./header/Header";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Header />
      {children}
    </Provider>
  );
}
