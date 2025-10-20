"use client";

import React, { useEffect, useState } from "react";
import { ClockIcon, CheckCircleIcon } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { NonMonetaryRecord } from "../types/nonMonetary";
import { listenToNonMonetaryRecords } from "../service";

export const NonMonetaryList: React.FC = () => {
  const [records, setRecords] = useState<NonMonetaryRecord[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);

  // ─── Fetch Non-Monetary Records from Firestore ────────────────
  useEffect(() => {
    const unsubscribe = listenToNonMonetaryRecords(setRecords);
    return () => unsubscribe();
  }, []);

  // ─── Separate Pending and Reported ─────────────────────────────
  const pendingRecords = records.filter(
    (r) => r.status === "pending" && !r.isArchived
  );
  const reportedRecords = records.filter(
    (r) => r.status === "reported" && !r.isArchived
  );

  const toDisplay = (record: NonMonetaryRecord) =>
    record.customDonationType || record.donationType;

  const toDestination = (record: NonMonetaryRecord) =>
    record.customDestination || record.donationDestination;

  const handlePreview = (files: string[]) => {
    setPreviewFiles(files);
    setPreviewOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">
        Non-Monetary Contributions
      </h1>

      <div className="flex w-full max-w-7xl mx-auto flex-col gap-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger value="pending" className="flex items-center gap-2 text-gray-700">
              <ClockIcon className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="reported" className="flex items-center gap-2 text-gray-700">
              <CheckCircleIcon className="h-4 w-4" />
              Reported
            </TabsTrigger>
          </TabsList>

          {/* ─── Pending Non-Monetary Records ───────────────────── */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">
                  Pending Non-Monetary Contributions
                </CardTitle>
                <CardDescription>Awaiting reporting or approval.</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contributor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Donation Type</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.fullName}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{toDisplay(record)}</TableCell>
                          <TableCell>{toDestination(record)}</TableCell>
                          <TableCell className="text-yellow-600 font-medium">
                            Pending
                          </TableCell>
                          <TableCell>
                            {record.dateCreated
                              ? new Date(record.dateCreated).toLocaleDateString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No pending non-monetary contributions found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Reported Non-Monetary Records ─────────────────── */}
          <TabsContent value="reported">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">
                  Reported Non-Monetary Contributions
                </CardTitle>
                <CardDescription>
                  Contributions that have been reported or processed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportedRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contributor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Donation Type</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportedRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.fullName}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{toDisplay(record)}</TableCell>
                          <TableCell>{toDestination(record)}</TableCell>
                          <TableCell className="text-green-600 font-medium">
                            Reported
                          </TableCell>
                          <TableCell>
                            {record.dateCreated
                              ? new Date(record.dateCreated).toLocaleDateString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No reported non-monetary contributions found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ─── Preview Dialog (Optional future use) ───────────────── */}
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
