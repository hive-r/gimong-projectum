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
  listenToAnnouncements,
  listenToEvents,
} from "../service";
import { AnnouncementRecord } from "../types/announcement";
import { EventRecord } from "../types/event";
import { EventCard } from "./eventCard";
import { AnnouncementCard } from "./announcementCard";
import { toast } from "sonner";

type SelectedMode = "view" | null;

export const ViewListAnnouncementEvent: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<
    AnnouncementRecord | EventRecord | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<SelectedMode>(null);

  useEffect(() => {
    const unsubscribe = listenToAnnouncements(setAnnouncements);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = listenToEvents(setEvents);
    return () => unsubscribe();
  }, []);

  function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // 🔹 Only View in Actions menu
  const renderActions = (record: AnnouncementRecord | EventRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedRecord(record);
            setMode("view");
            setDialogOpen(true);
          }}
        >
          View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Announcements & Events List
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Tabs defaultValue="announcement" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-primary">
            <TabsTrigger value="announcement" className="flex items-center gap-2 text-gray-700">
              <AppWindowIcon className="h-4 w-4" />
              Announcement
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-2 text-gray-700">
              <CalendarDaysIcon className="h-4 w-4" />
              Event
            </TabsTrigger>
            <TabsTrigger value="archive" className="flex items-center gap-2 text-gray-700">
              <ArchiveIcon className="h-4 w-4" />
              Archive
            </TabsTrigger>
          </TabsList>

          {/* Announcements */}
          <TabsContent value="announcement">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Announcements</CardTitle>
                <CardDescription className="text-lg">Available announcements.</CardDescription>
              </CardHeader>
              <CardContent>
                {announcements.filter((a) => !a.isArchived).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Pinned</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {announcements
                        .filter((a) => !a.isArchived)
                        .map((a) => (
                          <TableRow key={a.id}>
                            <TableCell>{a.title}</TableCell>
                            <TableCell>{a.description}</TableCell>
                            <TableCell>
                              {new Date(a.dateCreated).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{a.isPinned ? "Yes" : "No"}</TableCell>
                            <TableCell>{renderActions(a)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No active announcements.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events */}
          <TabsContent value="event">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Events</CardTitle>
                <CardDescription className="text-lg">Available events.</CardDescription>
              </CardHeader>
              <CardContent>
                {events.filter((e) => !e.isArchived).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Pinned</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events
                        .filter((e) => !e.isArchived)
                        .map((e) => (
                          <TableRow key={e.id}>
                            <TableCell>{e.title}</TableCell>
                            <TableCell>{e.description}</TableCell>
                            <TableCell>
                              {new Date(e.dateCreated).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{e.isPinned ? "Yes" : "No"}</TableCell>
                            <TableCell>{renderActions(e)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No active events.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Archive */}
          <TabsContent value="archive">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Archived Records</CardTitle>
                <CardDescription className="text-lg">
                  Announcements and events that were archived.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Archived Announcements */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Announcements</h3>
                  {announcements.filter((a) => a.isArchived).length > 0 ? (
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
                        {announcements
                          .filter((a) => a.isArchived)
                          .map((a) => (
                            <TableRow key={a.id}>
                              <TableCell>{a.title}</TableCell>
                              <TableCell>{a.description}</TableCell>
                              <TableCell>
                                {a.dateArchived
                                  ? new Date(a.dateArchived).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{renderActions(a)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">No archived announcements.</p>
                  )}
                </div>

                {/* Archived Events */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Events</h3>
                  {events.filter((e) => e.isArchived).length > 0 ? (
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
                        {events
                          .filter((e) => e.isArchived)
                          .map((e) => (
                            <TableRow key={e.id}>
                              <TableCell>{e.title}</TableCell>
                              <TableCell>{e.description}</TableCell>
                              <TableCell>
                                {e.dateArchived
                                  ? new Date(e.dateArchived).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{renderActions(e)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500">No archived events.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 🔹 View Dialog for Event */}
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
                  <img
                    src={selectedRecord.imageUrl}
                    alt="Event"
                    className="w-full h-full object-cover rounded-md shadow-md"
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

      {/* 🔹 View Dialog for Announcement */}
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
    </div>
  );
};
