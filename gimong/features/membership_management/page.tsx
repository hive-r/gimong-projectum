"use client";

import Form from "./components/form";
import { MembershipList } from "./components/listMembership";
import { MembershipStatistics } from "./components/membershipStatistics";

export const MembershipPage: React.FC = () => {
  return (
    <main className="w-full">
      <Form />
      <MembershipList />
      <MembershipStatistics />
    </main>
  );
};
