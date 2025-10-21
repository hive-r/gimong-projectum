"use client";

import React, { useEffect, useState } from "react";
import { ArchiveIcon, UsersIcon, UserMinus, MoreHorizontal } from "lucide-react";
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
    TableRow,
    TableHead,
    TableBody,
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
import { toast } from "sonner";

import { MembershipProfile } from "../types";
import {
    listenToMemberships,
    toggleArchiveMembership,
} from "../service";
import { MembershipEdit } from "./membershipEdit";
import { MembershipCard } from "./membershipCard";

type Mode = "edit" | "view" | null;

export const MembershipList: React.FC = () => {
    const [members, setMembers] = useState<MembershipProfile[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MembershipProfile | null>(null);
    const [mode, setMode] = useState<Mode>(null);

    // 🔹 Fetch membership data
    useEffect(() => {
        const unsubscribe = listenToMemberships(setMembers);
        return () => unsubscribe();
    }, []);

    // 🔹 Handle Actions
    async function handleAction(
        action: "archive" | "unarchive",
        member: MembershipProfile
    ) {
        try {
            await toggleArchiveMembership(member.id, action === "archive");
            toast.success(
                `Member ${action === "archive" ? "archived" : "unarchived"} successfully`
            );
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${action} member`);
        }
    }

    const renderActions = (member: MembershipProfile) => (
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
                        setSelectedMember(member);
                        setMode("edit");
                        setDialogOpen(true);
                    }}
                >
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setSelectedMember(member);
                        setMode("view");
                        setDialogOpen(true);
                    }}
                >
                    View
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        handleAction(member.isArchived ? "unarchive" : "archive", member)
                    }
                >
                    {member.isArchived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const activeMembers = members.filter(
        (m) => !m.isArchived && m.membershipStatus === "active"
    );
    const inactiveMembers = members.filter(
        (m) => !m.isArchived && m.membershipStatus === "inactive"
    );
    const archivedMembers = members.filter((m) => m.isArchived);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center uppercase">
                Membership List
            </h1>

            <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-primary">
                        <TabsTrigger value="active" className="flex items-center gap-2 text-gray-700">
                            <UsersIcon className="h-4 w-4" /> Active
                        </TabsTrigger>
                        <TabsTrigger value="inactive" className="flex items-center gap-2 text-gray-700">
                            <UserMinus className="h-4 w-4" /> Inactive
                        </TabsTrigger>
                        <TabsTrigger value="archived" className="flex items-center gap-2 text-gray-700">
                            <ArchiveIcon className="h-4 w-4" /> Archived
                        </TabsTrigger>
                    </TabsList>

                    {/* 🟢 Active Members */}
                    <TabsContent value="active">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl uppercase">Active Members</CardTitle>
                                <CardDescription className="text-lg">Currently active church members</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeMembers.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Sex</TableHead>
                                                <TableHead>Marital Status</TableHead>
                                                <TableHead>Membership Status</TableHead>
                                                <TableHead>Date Created</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {activeMembers.map((m) => (
                                                <TableRow key={m.id}>
                                                    <TableCell>
                                                        {m.firstName} {m.lastName}
                                                    </TableCell>
                                                    <TableCell className="capitalize">{m.sex}</TableCell>
                                                    <TableCell className="capitalize">
                                                        {m.maritalStatus}
                                                    </TableCell>
                                                    <TableCell className="capitalize">
                                                        {m.membershipStatus}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(m.dateCreated).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>{renderActions(m)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-gray-500 mt-4">
                                        No active members.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 🟠 Inactive Members */}
                    <TabsContent value="inactive">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl uppercase">Inactive Members</CardTitle>
                                <CardDescription className="text-lg">Members currently marked as inactive</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {inactiveMembers.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Membership Status</TableHead>
                                                <TableHead>Date Inactive</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inactiveMembers.map((m) => (
                                                <TableRow key={m.id}>
                                                    <TableCell>
                                                        {m.firstName} {m.lastName}
                                                    </TableCell>
                                                    <TableCell className="capitalize">
                                                        {m.membershipStatus}
                                                    </TableCell>
                                                    <TableCell>
                                                        {m.dateUpdated
                                                            ? new Date(m.dateUpdated).toLocaleDateString()
                                                            : "N/A"}
                                                    </TableCell>
                                                    <TableCell>{renderActions(m)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-gray-500 mt-4">
                                        No inactive members.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 📦 Archived Members */}
                    <TabsContent value="archived">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl uppercase">Archived Members</CardTitle>
                                <CardDescription className="text-lg">Inactive or archived member records</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {archivedMembers.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Date Archived</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {archivedMembers.map((m) => (
                                                <TableRow key={m.id}>
                                                    <TableCell>
                                                        {m.firstName} {m.lastName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {m.dateArchived
                                                            ? new Date(m.dateArchived).toLocaleDateString()
                                                            : "N/A"}
                                                    </TableCell>
                                                    <TableCell className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAction("unarchive", m)}
                                                        >
                                                            Unarchive
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-gray-500 mt-4">
                                        No archived members.
                                    </p>
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
                        <DialogTitle>Edit Member</DialogTitle>
                        <DialogDescription>Update member details below.</DialogDescription>
                    </DialogHeader>

                    {selectedMember && (
                        <MembershipEdit
                            record={selectedMember}
                            onClose={() => setDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* 🔹 View Dialog */}
            <Dialog open={dialogOpen && mode === "view"} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>View Member</DialogTitle>
                        <DialogDescription>Member details overview.</DialogDescription>
                    </DialogHeader>

                    {selectedMember && <MembershipCard member={selectedMember} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};
