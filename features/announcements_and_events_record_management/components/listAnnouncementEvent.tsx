"use client";

import React, { useEffect, useState } from "react";
import {
  AppWindowIcon,
  CalendarDaysIcon,
  ArchiveIcon,
  MoreHorizontal,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import {
  listenToAnnouncements,
  listenToEvents,
  toggleArchiveRecord,
  togglePinRecord,
  deleteAnnouncement,
  deleteEvent,
} from "../service";
import { AnnouncementRecord } from "../types/announcement";
import { EventRecord } from "../types/event";

import { AnnouncementEdit } from "./announcementEdit";
import { EventEdit } from "./eventEdit";
import { EventCard } from "./eventCard";
import { AnnouncementCard } from "./announcementCard";
import Image from "next/image";
import { toast } from "sonner";

type SelectedMode = "edit" | "view" | null;

export const AnnouncementEventList: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);

  const [selectedRecord, setSelectedRecord] = useState<
    AnnouncementRecord | EventRecord | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<SelectedMode>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<
    AnnouncementRecord | EventRecord | null
  >(null);

  // 🔹 Pagination States
  const [pageSize, setPageSize] = useState(10);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [archivePage, setArchivePage] = useState(1);

  useEffect(() => {
    const unsubA = listenToAnnouncements(setAnnouncements);
    const unsubE = listenToEvents(setEvents);
    return () => {
      unsubA();
      unsubE();
    };
  }, []);

  // 🔹 Centralized action handler
  async function handleRecordAction(
    action: "delete" | "pin" | "archive" | "unarchive",
    record: AnnouncementRecord | EventRecord
  ) {
    try {
      if (action === "delete") {
        setRecordToDelete(record);
        setDeleteDialogOpen(true);
        return;
      }

      if (action === "pin") {
        await togglePinRecord(
          record.type === "announcement" ? "announcements" : "events",
          record.id,
          !record.isPinned
        );
        toast.success(
          record.isPinned
            ? `${capitalize(record.type)} unpinned successfully.`
            : `${capitalize(record.type)} pinned successfully.`
        );
        return;
      }

      if (action === "archive") {
        if (record.isPinned) {
          toast.error(
            `You cannot archive a pinned ${record.type}. Unpin it first.`
          );
          return;
        }
        await toggleArchiveRecord(
          record.type === "announcement" ? "announcements" : "events",
          record.id,
          true
        );
        toast.success(`${capitalize(record.type)} archived successfully.`);
        return;
      }

      if (action === "unarchive") {
        await toggleArchiveRecord(
          record.type === "announcement" ? "announcements" : "events",
          record.id,
          false
        );
        toast.success(`${capitalize(record.type)} unarchived successfully.`);
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} ${record.type}.`);
    }
  }

  async function confirmDelete() {
    if (!recordToDelete) return;
    try {
      if (recordToDelete.type === "announcement") {
        await deleteAnnouncement(recordToDelete.id);
        setAnnouncements((prev) => prev.filter((a) => a.id !== recordToDelete.id));
      } else {
        await deleteEvent(recordToDelete.id);
        setEvents((prev) => prev.filter((e) => e.id !== recordToDelete.id));
      }
      toast.success(`${capitalize(recordToDelete.type)} deleted successfully.`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete ${recordToDelete.type}.`);
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  }

  function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // 🔹 Pagination helper
  const paginate = <T,>(items: T[], page: number): T[] =>
    items.slice((page - 1) * pageSize, page * pageSize);

  // 🔹 Pagination Component (same as MembershipList)
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

  // 🔹 Filtering
  const filteredAnnouncements = announcements.filter((a) => !a.isArchived);
  const filteredEvents = events.filter((e) => !e.isArchived);
  const archivedRecords = [
    ...announcements.filter((a) => a.isArchived),
    ...events.filter((e) => e.isArchived),
  ];

  // 🔹 Actions menu
  const renderActions = (record: AnnouncementRecord | EventRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedRecord(record);
            setMode("edit");
            setDialogOpen(true);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedRecord(record);
            setMode("view");
            setDialogOpen(true);
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRecordAction("pin", record)}>
          {record.isPinned ? "Unpin" : "Pin"}
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
        Announcements & Events List
      </h1>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="announcement" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-primary">
            <TabsTrigger value="announcement" className="text-gray-700 flex items-center gap-2">
              <AppWindowIcon className="h-4 w-4" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="event" className="text-gray-700 flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="archive" className="text-gray-700 flex items-center gap-2">
              <ArchiveIcon className="h-4 w-4" /> Archived
            </TabsTrigger>
          </TabsList>

          {/* 🟢 Announcements */}
          <TabsContent value="announcement">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Announcements</CardTitle>
                <CardDescription>Available announcements</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAnnouncements.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Pinned</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginate(filteredAnnouncements, announcementPage).map((a) => (
                          <TableRow key={a.id}>
                            <TableCell>{a.title}</TableCell>
                            <TableCell>{a.description}</TableCell>
                            <TableCell>{new Date(a.dateCreated).toLocaleDateString()}</TableCell>
                            <TableCell>{a.isPinned ? "Yes" : "No"}</TableCell>
                            <TableCell>{renderActions(a)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {renderPagination(announcementPage, setAnnouncementPage, filteredAnnouncements.length)}
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-4">No announcements.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 🟠 Events */}
          <TabsContent value="event">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Events</CardTitle>
                <CardDescription>Available events</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Pinned</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginate(filteredEvents, eventPage).map((e) => (
                          <TableRow key={e.id}>
                            <TableCell>{e.title}</TableCell>
                            <TableCell>{e.description}</TableCell>
                            <TableCell>{new Date(e.dateCreated).toLocaleDateString()}</TableCell>
                            <TableCell>{e.isPinned ? "Yes" : "No"}</TableCell>
                            <TableCell>{renderActions(e)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {renderPagination(eventPage, setEventPage, filteredEvents.length)}
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-4">No events.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 📦 Archived */}
          <TabsContent value="archive">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Archived</CardTitle>
                <CardDescription>Archived announcements & events</CardDescription>
              </CardHeader>
              <CardContent>
                {archivedRecords.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date Archived</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginate(archivedRecords, archivePage).map((r) => (
                          <TableRow key={r.id}>
                            <TableCell>{r.type}</TableCell>
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
                    {renderPagination(archivePage, setArchivePage, archivedRecords.length)}
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-4">No archived records.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 🔹 Edit Dialog */}
      <Dialog open={dialogOpen && mode === "edit"} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              Edit {selectedRecord?.type}
            </DialogTitle>
            <DialogDescription>
              Update the details of this {selectedRecord?.type}.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <>
              {selectedRecord.type === "announcement" && (
                <AnnouncementEdit
                  record={selectedRecord as AnnouncementRecord}
                  onClose={() => setDialogOpen(false)}
                />
              )}
              {selectedRecord.type === "event" && (
                <EventEdit
                  record={selectedRecord as EventRecord}
                  onClose={() => setDialogOpen(false)}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 🔹 View Event Dialog */}
      {selectedRecord?.type === "event" && (
        <Dialog open={dialogOpen && mode === "view"} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>View Event</DialogTitle>
              <DialogDescription>Here are the details of the selected event.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full">
              <div className="w-full h-[350px] flex justify-center items-center">
                {selectedRecord.imageUrl ? (
                  <Image
                    src={selectedRecord.imageUrl}
                    alt="Event"
                    width={700} // desired width
                    height={350} // desired height
                    className="w-full h-full object-cover rounded-md shadow-md"
                    priority={true} // optional: for faster loading of pinned/important images
                  />
                ) : (
                  <div className="w-full h-[350px] flex items-center justify-center border border-dashed text-gray-400">
                    No Image
                  </div>
                )}

              </div>
              <div className="h-full">
                <EventCard event={selectedRecord as EventRecord} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 🔹 View Announcement Dialog */}
      {selectedRecord?.type === "announcement" && (
        <Dialog open={dialogOpen && mode === "view"} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>View Announcement</DialogTitle>
              <DialogDescription>Here are the details of the selected announcement.</DialogDescription>
            </DialogHeader>

            <AnnouncementCard announcement={selectedRecord as AnnouncementRecord} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {recordToDelete?.type}.
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
