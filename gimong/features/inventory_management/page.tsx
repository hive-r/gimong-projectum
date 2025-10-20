"use client";

import { SermonDevtionalCard } from "./components/card";
import { IForm } from "./components/form";
import { InventoryList } from "./components/listInventory";

export const InventoryPage: React.FC = () => {
  return (
    <main className="w-full">
      <IForm />
      <InventoryList />
      <SermonDevtionalCard />
    </main>
  );
};
