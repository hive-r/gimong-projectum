"use client";

import React, { useEffect, useState } from "react";
import { ArchiveIcon, CoinsIcon, GiftIcon, MoreHorizontal } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { NonMonetaryRecord } from "../types/nonMonetary";
import { MonetaryRecord } from "../types/monetary";
import {
  listenToMonetaryRecords,
  listenToNonMonetaryRecords,
  deleteMonetaryRecord,
  deleteNonMonetaryRecord,
  toggleArchiveRecord,
} from "../service";
import { MonetaryEdit } from "./monetaryEdit";
import { NonMonetaryEdit } from "./nonMonetaryEdit";
import { FinanceCard } from "./financeCard";

type RecordType = MonetaryRecord | NonMonetaryRecord;
type SelectedMode = "edit" | "view";

export const MonetaryNonMonetaryList: React.FC = () => {
  const [monetaryRecords, setMonetaryRecords] = useState<MonetaryRecord[]>([]);
  const [nonMonetaryRecords, setNonMonetaryRecords] = useState<NonMonetaryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<SelectedMode>("edit");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<RecordType | null>(null);

  useEffect(() => listenToMonetaryRecords(setMonetaryRecords), []);
  useEffect(() => listenToNonMonetaryRecords(setNonMonetaryRecords), []);

  const handleRecordAction = async (
    action: "archive" | "unarchive" | "edit" | "view",
    record: RecordType
  ) => {
    try {
      if (action === "archive" || action === "unarchive") {
        const collectionName =
          "amount" in record ? "monetary_records" : "non_monetary_records";
        await toggleArchiveRecord(collectionName, record.id, action === "archive");
        toast.success(`Record ${action === "archive" ? "archived" : "unarchived"} successfully!`);
        return;
      }

      if (action === "edit" || action === "view") {
        setSelectedRecord(record);
        setMode(action);
        setDialogOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} record.`);
    }
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      if ("amount" in recordToDelete) {
        await deleteMonetaryRecord(recordToDelete.id);
        setMonetaryRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      } else {
        await deleteNonMonetaryRecord(recordToDelete.id);
        setNonMonetaryRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      }
      toast.success("Record deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record.");
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const renderActions = (record: RecordType) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleRecordAction("edit", record)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRecordAction("view", record)}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRecordAction(record.isArchived ? "unarchive" : "archive", record)}>
          {record.isArchived ? "Unarchive" : "Archive"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const toSentenceCase = (text: string | number | undefined) => {
    if (text === undefined || text === null) return "-";
    const str = String(text).toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Totals for active records
  const totalMonetary = monetaryRecords
    .filter((r) => !r.isArchived && typeof r.amount === "number")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalNonMonetary = nonMonetaryRecords.filter((r) => !r.isArchived).length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Monetary & Non-Monetary List
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Tabs defaultValue="monetary" className="w-full">
          {/* Tab Headers */}
          <TabsList className="grid w-full grid-cols-3 bg-primary">
            <TabsTrigger value="monetary" className="flex items-center gap-2 text-gray-700">
              <CoinsIcon className="h-4 w-4" />
              Monetary
            </TabsTrigger>

            <TabsTrigger value="non-monetary" className="flex items-center gap-2 text-gray-700">
              <GiftIcon className="h-4 w-4" />
              Non-Monetary
            </TabsTrigger>

            <TabsTrigger value="archive" className="flex items-center gap-2 text-gray-700">
              <ArchiveIcon className="h-4 w-4" />
              Archive
            </TabsTrigger>
          </TabsList>

          {/* Monetary Tab */}
          <TabsContent value="monetary">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Monetary Records</CardTitle>
                <CardDescription className="text-lg">All monetary contributions.</CardDescription>
              </CardHeader>
              <CardContent>
                {monetaryRecords.filter((r) => !r.isArchived).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Donation Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monetaryRecords
                        .filter((r) => !r.isArchived)
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.fullName}</TableCell>
                            <TableCell>{toSentenceCase(record.donationType)}</TableCell>
                            <TableCell>
                              {record.amount} {record.currency}
                            </TableCell>
                            <TableCell>
                              {new Date(record.dateCreated).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{renderActions(record)}</TableCell>
                          </TableRow>
                        ))}
                      {/* Totals row */}
                      <TableRow className="font-bold border-t border-gray-300">
                        <TableCell>Total</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{totalMonetary}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No monetary records.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Non-Monetary Tab */}
          <TabsContent value="non-monetary">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Non-Monetary Records</CardTitle>
                <CardDescription className="text-lg">All non-monetary contributions.</CardDescription>
              </CardHeader>
              <CardContent>
                {nonMonetaryRecords.filter((r) => !r.isArchived).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Donation Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nonMonetaryRecords
                        .filter((r) => !r.isArchived)
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.fullName}</TableCell>
                            <TableCell>{toSentenceCase(record.donationType)}</TableCell>
                            <TableCell>{record.description || "-"}</TableCell>
                            <TableCell>
                              {new Date(record.dateCreated).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{renderActions(record)}</TableCell>
                          </TableRow>
                        ))}
                      {/* Totals row */}
                      <TableRow className="font-bold border-t border-gray-300">
                        <TableCell>Total</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{totalNonMonetary} donations</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No non-monetary records.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Archive Tab remains unchanged */}
          <TabsContent value="archive">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Archived Records</CardTitle>
                <CardDescription className="text-lg">All archived contributions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Archived Monetary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Monetary</h3>
                  {monetaryRecords.filter((r) => r.isArchived).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Donation Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date Archived</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monetaryRecords
                          .filter((r) => r.isArchived)
                          .map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{record.fullName}</TableCell>
                              <TableCell>{toSentenceCase(record.donationType)}</TableCell>
                              <TableCell>
                                {record.amount} {record.currency}
                              </TableCell>
                              <TableCell>
                                {record.dateArchived
                                  ? new Date(record.dateArchived).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRecordAction("unarchive", record)}
                                >
                                  Unarchive
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">No archived monetary records.</p>
                  )}
                </div>

                {/* Archived Non-Monetary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Non-Monetary</h3>
                  {nonMonetaryRecords.filter((r) => r.isArchived).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Donation Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date Archived</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nonMonetaryRecords
                          .filter((r) => r.isArchived)
                          .map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{record.fullName}</TableCell>
                              <TableCell>{toSentenceCase(record.donationType)}</TableCell>
                              <TableCell>{toSentenceCase(record.description || "-")}</TableCell>
                              <TableCell>
                                {record.dateArchived
                                  ? new Date(record.dateArchived).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRecordAction("unarchive", record)}
                                >
                                  Unarchive
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">No archived non-monetary records.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 🔹 Edit Dialog */}
      <Dialog open={dialogOpen && mode === "edit"} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>Update the details of this record.</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            "amount" in selectedRecord ? (
              <MonetaryEdit
                record={selectedRecord as MonetaryRecord}
                onClose={() => setDialogOpen(false)}
              />
            ) : (
              <NonMonetaryEdit
                record={selectedRecord as NonMonetaryRecord}
                onClose={() => setDialogOpen(false)}
              />
            )
          )}
        </DialogContent>
      </Dialog>

      {/* 🔹 View Dialog */}
      <Dialog open={dialogOpen && mode === "view"} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>View Record</DialogTitle>
            <DialogDescription>Details of the selected record.</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <FinanceCard record={selectedRecord} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
