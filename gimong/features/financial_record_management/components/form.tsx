"use client";

import React from "react";
import { DollarSign, Package, PiggyBank, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MonetaryForm } from "./monetaryForm";
import { NonMonetaryForm } from "./nonMonetaryForm";
import { CashoutForm } from "./cashoutForm";
import { CashoutReportForm } from "./cashoutReportForm";
import { NonMonetaryReportForm } from "./nonMonetaryReportForm";

export const FinancialForm: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Financial Records Form
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Tabs defaultValue="monetary" className="w-full">
          {/* Main Tabs */}
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger value="monetary" className="flex items-center gap-2 text-gray-700">
              <DollarSign className="h-4 w-4" />
              Monetary
            </TabsTrigger>
            <TabsTrigger value="nonMonetary" className="flex items-center gap-2 text-gray-700">
              <Package className="h-4 w-4" />
              Non-Monetary
            </TabsTrigger>
          </TabsList>

          {/* Monetary Form with Nested Tabs */}
          <TabsContent value="monetary">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Monetary Record</CardTitle>
                <CardDescription className="text-lg">
                  Manage both donations and cashouts here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Nested Tabs */}
                <Tabs defaultValue="donation" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-200 mb-4">
                    <TabsTrigger value="donation" className="flex items-center gap-2">
                      <PiggyBank className="h-4 w-4" />
                      Donation
                    </TabsTrigger>
                    <TabsTrigger value="cashout" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Cashout
                    </TabsTrigger>
                    <TabsTrigger value="report" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Report
                    </TabsTrigger>
                  </TabsList>

                  {/* Donation Tab */}
                  <TabsContent value="donation">
                    <MonetaryForm />
                  </TabsContent>

                  {/* Cashout Tab */}
                  <TabsContent value="cashout">
                    <CashoutForm />
                  </TabsContent>

                  <TabsContent value="report">
                    <CashoutReportForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Non-Monetary Form */}
          <TabsContent value="nonMonetary">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Non-Monetary</CardTitle>
                <CardDescription className="text-lg">
                  Manage non-monetary records and reports here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Nested Tabs for Non-Monetary */}
                <Tabs defaultValue="record" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-200 mb-4">
                    <TabsTrigger value="record" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Record
                    </TabsTrigger>
                    <TabsTrigger value="report" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Report
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="record">
                    <NonMonetaryForm />
                  </TabsContent>

                  <TabsContent value="report">
                    <NonMonetaryReportForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
