"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import Header from "./header/Header";
import Navigation from "./header/ui/Navigation";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Header />
      <Navigation />
      {children}
    </Provider>
  );
}
