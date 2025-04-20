"use client";

import { ReactNode } from "react";
import { DataProvider } from "@/contexts/DataContext";

export default function ClientBody({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>;
}
