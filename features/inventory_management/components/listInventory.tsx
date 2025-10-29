"use client";

import React, { useEffect, useState } from "react";
import { ArchiveIcon, BookOpenIcon, HeartHandshakeIcon, MoreHorizontal } from "lucide-react";
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
import { toast } from "sonner";

import { InventoryItem } from "../types";
import {
  listenToInventory,
  toggleArchiveInventoryItem,
  deleteInventoryItem,
} from "../service";
import { storage } from "@/services/appwrite/config";
import { InventoryCard } from "./inventoryCard";

export const InventoryList: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => listenToInventory(setInventoryItems), []);

  const handleAction = async (
    action: "archive" | "unarchive" | "delete" | "view",
    item: InventoryItem
  ) => {
    try {
      if (action === "delete") {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
        return;
      }
      if (action === "view") {
        setSelectedItem(item);
        setViewDialogOpen(true);
        return;
      }
      if (!item.firestoreId) throw new Error("Missing Firestore ID");
      if (action === "archive" || action === "unarchive") {
        await toggleArchiveInventoryItem(item.firestoreId, action === "archive");
        toast.success(`Inventory ${action === "archive" ? "archived" : "unarchived"} successfully`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} inventory`);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.bucketId && itemToDelete.appwriteId) {
        await storage.deleteFile(itemToDelete.bucketId, itemToDelete.appwriteId);
      }
      if (itemToDelete.firestoreId) {
        await deleteInventoryItem(itemToDelete.firestoreId);
      }
      toast.success("Inventory deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inventory.");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const renderDropdownActions = (item: InventoryItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("view", item)}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(item.isArchived ? "unarchive" : "archive", item)}>
          {item.isArchived ? "Unarchive" : "Archive"}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => handleAction("delete", item)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderButtonActions = (item: InventoryItem) => (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => handleAction("view", item)}>View</Button>
      <Button size="sm" variant="outline" onClick={() => handleAction("unarchive", item)}>Unarchive</Button>
      <Button size="sm" variant="destructive" onClick={() => handleAction("delete", item)}>Delete</Button>
    </div>
  );

  // 🔹 Pagination Logic
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const paginate = (items: InventoryItem[]) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const sermons = inventoryItems.filter(i => !i.isArchived && i.category === "sermon");
  const devotionals = inventoryItems.filter(i => !i.isArchived && i.category === "devotional");
  const archivedItems = inventoryItems.filter(i => i.isArchived);

  const totalPages = (items: InventoryItem[]) =>
    Math.ceil(items.length / ITEMS_PER_PAGE);

  const renderPagination = (items: InventoryItem[]) => {
    if (items.length <= ITEMS_PER_PAGE) return null;

    const total = totalPages(items);

    return (
      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {total}
        </span>
        <Button
          variant="outline"
          disabled={page === total}
          onClick={() => setPage((p) => Math.min(p + 1, total))}
        >
          Next
        </Button>
      </div>
    );
  };

  const renderTable = (items: InventoryItem[], showCategory = true, useButtons = false) =>
    items.length > 0 ? (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              {showCategory && <TableHead>Category</TableHead>}
              <TableHead>Date Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginate(items).map(item => (
              <TableRow key={item.firestoreId ?? item.appwriteId}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.description.slice(0, 50)}
                  {item.description.length > 50 ? "..." : ""}
                </TableCell>
                {showCategory && <TableCell>{item.category}</TableCell>}
                <TableCell>{new Date(item.uploadedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {useButtons ? renderButtonActions(item) : renderDropdownActions(item)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {renderPagination(items)}
      </>
    ) : (
      <p className="text-center text-gray-500 mt-4">No items found.</p>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">Resource List</h1>
      <div className="flex w-full max-w-5xl mx-auto flex-col gap-4">
        <Tabs defaultValue="sermon" className="w-full" onValueChange={() => setPage(1)}>
          <TabsList className="grid w-full grid-cols-3 bg-primary">
            <TabsTrigger value="sermon" className="flex items-center gap-2 text-gray-700">
              <BookOpenIcon className="h-4 w-4" />
              Sermons
            </TabsTrigger>
            <TabsTrigger value="devotional" className="flex items-center gap-2 text-gray-700">
              <HeartHandshakeIcon className="h-4 w-4" />
              Devotionals
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2 text-gray-700">
              <ArchiveIcon className="h-4 w-4" />
              Archived
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sermon">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Sermon Inventory</CardTitle>
                <CardDescription className="text-lg">All sermon files.</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(sermons, false)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devotional">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Devotional Inventory</CardTitle>
                <CardDescription className="text-lg">All devotional files.</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(devotionals, false)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Archived Inventory</CardTitle>
                <CardDescription className="text-lg">Previously archived files.</CardDescription>
              </CardHeader>
              <CardContent>{renderTable(archivedItems, true, true)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 🔹 View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>View Item</DialogTitle>
            <DialogDescription>Item details overview.</DialogDescription>
          </DialogHeader>
          {selectedItem && <InventoryCard item={selectedItem} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {itemToDelete?.name}.
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
