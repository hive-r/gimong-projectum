"use client";

import React, { useEffect, useState } from "react";
import { ClockIcon, CheckCircleIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CashoutRecord, CashoutReport } from "../types/cashout";
import { listenToCashoutRecords, listenToCashoutReports } from "../service";

export const CashoutList: React.FC = () => {
  const [cashouts, setCashouts] = useState<CashoutRecord[]>([]);
  const [reports, setReports] = useState<CashoutReport[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);

  useEffect(() => {
    const unsubCashouts = listenToCashoutRecords((records) => setCashouts(records));
    const unsubReports = listenToCashoutReports((records) => setReports(records));
    return () => {
      unsubCashouts();
      unsubReports();
    };
  }, []);

  const pendingCashouts = cashouts.filter((c) => c.status === "pending");
  const reportedCashouts = reports.filter((r) => {
    const cashout = cashouts.find((c) => c.id === r.cashoutId);
    return cashout?.status === "reported";
  });

  const toSentenceCase = (text?: string) => {
    if (!text) return "-";
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const handlePreview = (files: string[]) => {
    setPreviewFiles(files);
    setPreviewOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">Cashout Management</h1>

      <div className="flex w-full max-w-6xl mx-auto flex-col gap-6">
        <Tabs defaultValue="cashouts" className="w-full">
          {/* Tabs Header */}
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger value="cashouts" className="flex items-center gap-2 text-gray-700">
              <ClockIcon className="h-4 w-4" />
              Pending Cashouts
            </TabsTrigger>
            <TabsTrigger value="reported" className="flex items-center gap-2 text-gray-700">
              <CheckCircleIcon className="h-4 w-4" />
              Reported Cashouts
            </TabsTrigger>
          </TabsList>

          {/* Pending Cashouts Tab */}
          <TabsContent value="cashouts">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Pending Cashouts</CardTitle>
                <CardDescription>Cashouts with status "pending".</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingCashouts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Source Fund</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Approved By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingCashouts.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.amount.toLocaleString()} {record.currency}</TableCell>
                          <TableCell>{toSentenceCase(record.purpose)}</TableCell>
                          <TableCell>{toSentenceCase(record.sourceFund)}</TableCell>
                          <TableCell>{toSentenceCase(record.requestedBy)}</TableCell>
                          <TableCell>{toSentenceCase(record.approvedBy)}</TableCell>
                          <TableCell className="font-medium text-yellow-600">{toSentenceCase(record.status)}</TableCell>
                          <TableCell>{new Date(record.dateCreated).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">No pending cashouts.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reported Cashouts Tab */}
          <TabsContent value="reported">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Reported Cashouts</CardTitle>
                <CardDescription>Cashouts that have been reported.</CardDescription>
              </CardHeader>
              <CardContent>
                {reportedCashouts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Files</TableHead>
                        <TableHead>Source Fund</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportedCashouts.map((report) => {
                        const cashout = cashouts.find((c) => c.id === report.cashoutId);
                        return (
                          <TableRow key={report.id}>
                            <TableCell>{cashout ? `${cashout.amount.toLocaleString()} ${cashout.currency}` : "-"}</TableCell>
                            <TableCell>{report.description || "-"}</TableCell>
                            <TableCell>
                              {report.files && report.files.length > 0 ? (
                                <button
                                  className="text-blue-600 underline"
                                  onClick={() => handlePreview(report.files)}
                                >
                                  View ({report.files.length})
                                </button>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{cashout ? toSentenceCase(cashout.sourceFund) : "-"}</TableCell>
                            <TableCell>{report.submittedBy || "-"}</TableCell>
                            <TableCell className="font-medium text-green-600">Reported</TableCell>
                            <TableCell>{cashout ? new Date(cashout.dateCreated).toLocaleDateString() : "-"}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">No reported cashouts.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Files Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Files Preview</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {previewFiles.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Preview ${i + 1}`}
                className="object-cover w-full h-32 rounded-lg"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
