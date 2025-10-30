"use client";

import React, { useEffect, useState } from "react";
import { VideoIcon, ArchiveIcon, MoreHorizontal } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import Image from "next/image";
import {
  listenToLiveStreams,
  toggleArchiveLiveStream,
  deleteLiveStream,
  toggleDisplayLiveStream,
} from "../service";
import { LiveStreamRecord } from "../livestream";
import { LiveStreamEdit } from "./livestreamEdit";
import { LiveStreamCard } from "./livestreamCard";

type SelectedMode = "edit" | "view" | null;

export const LiveStreamList: React.FC = () => {
  const [liveStreams, setLiveStreams] = useState<LiveStreamRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<LiveStreamRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<SelectedMode>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<LiveStreamRecord | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [archivePage, setArchivePage] = useState(1);

  useEffect(() => {
    const unsub = listenToLiveStreams(setLiveStreams);
    return () => unsub();
  }, []);

  async function handleRecordAction(
    action: "delete" | "archive" | "unarchive" | "view" | "display" | "edit",
    record: LiveStreamRecord
  ) {
    try {
      if (action === "delete") {
        setRecordToDelete(record);
        setDeleteDialogOpen(true);
        return;
      }

      if (action === "archive") {
        await toggleArchiveLiveStream(record.id, true);
        toast.success("Live stream archived successfully.");
        return;
      }

      if (action === "unarchive") {
        await toggleArchiveLiveStream(record.id, false);
        toast.success("Live stream unarchived successfully.");
        return;
      }

      if (action === "edit" || action === "view") {
        setSelectedRecord(record);
        setMode(action);
        setDialogOpen(true);
        return;
      }

      if (action === "display") {
        const newDisplayValue = !record.isDisplay;
        await toggleDisplayLiveStream(record.id, newDisplayValue);

        toast.success(
          newDisplayValue
            ? "Live stream is now visible for display."
            : "Live stream is now hidden from display."
        );
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} live stream.`);
    }
  }

  async function confirmDelete() {
    if (!recordToDelete) return;
    try {
      await deleteLiveStream(recordToDelete.id);
      setLiveStreams((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      toast.success("Live stream deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete live stream.");
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  }

  const paginate = <T,>(items: T[], page: number): T[] =>
    items.slice((page - 1) * pageSize, page * pageSize);

  const renderPagination = (
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalItems: number
  ) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const activeStreams = liveStreams.filter((s) => !s.isArchived);
  const archivedStreams = liveStreams.filter((s) => s.isArchived);

  const renderActions = (record: LiveStreamRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleRecordAction("edit", record)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRecordAction("view", record)}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRecordAction("display", record)}>
          {record.isDisplay ? "Hide from Display" : "Show on Display"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRecordAction("archive", record)}>
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => handleRecordAction("delete", record)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Live Streams List
      </h1>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger value="active" className="flex items-center gap-2 text-gray-700">
              <VideoIcon className="h-4 w-4" /> Live Streams
            </TabsTrigger>
            <TabsTrigger value="archive" className="flex items-center gap-2 text-gray-700">
              <ArchiveIcon className="h-4 w-4" /> Archived
            </TabsTrigger>
          </TabsList>

          {/* Active Live Streams */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Live Streams</CardTitle>
                <CardDescription>Active or Upcoming live streams</CardDescription>
              </CardHeader>
              <CardContent>
                {activeStreams.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date Created</TableHead>
                          <TableHead>Display</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginate(activeStreams, activePage).map((r) => (
                          <TableRow
                            key={r.id}
                          >
                            <TableCell>{r.title}</TableCell>
                            <TableCell>{r.description}</TableCell>
                            <TableCell>
                              {new Date(r.dateCreated).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {r.isDisplay ? (
                                <span className="text-green-600">Visible</span>
                              ) : (
                                <span className="text-gray-500">Hidden</span>
                              )}
                            </TableCell>
                            <TableCell>{renderActions(r)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {renderPagination(activePage, setActivePage, activeStreams.length)}
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No live streams available.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Archived Live Streams */}
          <TabsContent value="archive">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Archived</CardTitle>
                <CardDescription>Archived live streams</CardDescription>
              </CardHeader>
              <CardContent>
                {archivedStreams.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date Archived</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginate(archivedStreams, archivePage).map((r) => (
                          <TableRow key={r.id}>
                            <TableCell>{r.title}</TableCell>
                            <TableCell>{r.description}</TableCell>
                            <TableCell>
                              {r.dateArchived
                                ? new Date(r.dateArchived).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRecordAction("unarchive", r)}
                              >
                                Unarchive
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRecordAction("delete", r)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {renderPagination(archivePage, setArchivePage, archivedStreams.length)}
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No archived streams.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen && mode === "edit"} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Live Stream</DialogTitle>
            <DialogDescription>Update the live stream details.</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <LiveStreamEdit record={selectedRecord} onClose={() => setDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* 🔹 View Live Stream Dialog */}
      {mode === "view" && selectedRecord && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>View Live Stream</DialogTitle>
              <DialogDescription>
                Here are the details of the selected live stream.
              </DialogDescription>
            </DialogHeader>

            {/* Layout: Image on left, details on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full">
              {/* Image Section */}
              <div className="w-full h-[350px] flex justify-center items-center">
                {selectedRecord.imageUrl ? (
                  <Image
                    src={selectedRecord.imageUrl}
                    alt="Live Stream"
                    width={700}
                    height={350}
                    className="w-full h-full object-cover rounded-md shadow-md"
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-[350px] flex items-center justify-center border border-dashed text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Live Stream Card Details */}
              <div className="h-full">
                <LiveStreamCard liveStream={selectedRecord} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Live Stream?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
