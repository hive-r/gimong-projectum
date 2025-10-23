"use client";

import React, { useState } from "react";
import {
  HomeIcon,
  FileTextIcon,
  TableIcon,
  ChartBarIcon,
  BoxIcon,
  LogOutIcon,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebase/config";

import { ProtectedRoute } from "@/services/firebase/components/protectedRoute";

import { AnnouncementEventStatistics } from "@/features/announcements_and_events_record_management/components/announcementEventStatistics";
import { AnnouncementEventCard } from "@/features/announcements_and_events_record_management/components/card";
import { AnnouncementEventForm } from "@/features/announcements_and_events_record_management/components/form";
import { AnnouncementEventList } from "@/features/announcements_and_events_record_management/components/listAnnouncementEvent";
import { FinancialStatistics } from "@/features/financial_record_management/components/financialStatistics";
import { FinancialForm } from "@/features/financial_record_management/components/form";
import { MonetaryNonMonetaryList } from "@/features/financial_record_management/components/listFinance";
import { MembershipList } from "@/features/membership_management/components/listMembership";
import { MembershipStatistics } from "@/features/membership_management/components/membershipStatistics";
import { SermonDevtionalCard } from "@/features/inventory_management/components/card";
import { InventoryList } from "@/features/inventory_management/components/listInventory";
import { IForm } from "@/features/inventory_management/components/form";
import { MForm } from "@/features/membership_management/components/form";
import { CashoutList } from "@/features/financial_record_management/components/cashoutList";
import { NonMonetaryList } from "@/features/financial_record_management/components/nonMonetaryReports";

type Tab = "dashboard" | "event" | "finance" | "member" | "inventory";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You’ve successfully logged out."); // ✅ success toast
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out. Please try again."); // ❌ error toast
    }
  };

  const navItems: { name: string; tab: Tab; icon: React.ElementType }[] = [
    { name: "Dashboard", tab: "dashboard", icon: HomeIcon },
    { name: "Event & Announcement", tab: "event", icon: FileTextIcon },
    { name: "Financial Management", tab: "finance", icon: TableIcon },
    { name: "Membership Management", tab: "member", icon: ChartBarIcon },
    { name: "Inventory Management", tab: "inventory", icon: BoxIcon },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col sticky top-0 h-screen shadow-sm">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              Admin Panel
            </h2>
          </div>

          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 w-full text-left font-medium ${
                  activeTab === item.tab
                    ? "bg-gray-100 text-gray-900 shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                    activeTab === item.tab
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </span>
                <span className="text-lg">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full py-3 mt-6 text-red-600 hover:text-white hover:bg-red-600 rounded-lg font-semibold transition-colors duration-200"
              >
              <LogOutIcon className="w-5 h-5" />
              Logout
            </button>
            <div className="pt-6 text-center text-gray-400 text-sm">
              © 2025 Church Admin Panel
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <AnnouncementEventStatistics />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <FinancialStatistics />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <MembershipStatistics />
              </div>
            </div>
          )}

          {/* Event */}
          {activeTab === "event" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <AnnouncementEventForm />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <AnnouncementEventList />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <AnnouncementEventCard />
              </div>
            </div>
          )}

          {/* Finance */}
          {activeTab === "finance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <FinancialForm />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <MonetaryNonMonetaryList />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <CashoutList />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <NonMonetaryList />
              </div>
            </div>
          )}

          {/* Member */}
          {activeTab === "member" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <MForm />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <MembershipList />
              </div>
            </div>
          )}

          {/* Inventory */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <IForm />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <InventoryList />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <SermonDevtionalCard />
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
