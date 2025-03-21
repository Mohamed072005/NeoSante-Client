"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, MoreHorizontal, CheckCircle, AlertCircle } from "lucide-react";
import type { Pharmacy } from "@/lib/types/pharmacy";
import { format } from "date-fns";

interface PharmacyColumnsProps {
    onStatusChange?: (id: string, status: "active" | "pending" | "suspended") => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
    onEdit?: (id: string) => void;
    isAdmin: boolean;
}

export const PharmacyColumns = ({ onStatusChange, onDelete, onView, onEdit, isAdmin }: PharmacyColumnsProps): ColumnDef<Pharmacy>[] => {
    const baseColumns: ColumnDef<Pharmacy>[] = [
        {
            accessorKey: "name",
            header: "Pharmacy Name",
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "address.city",
            header: "Location",
            cell: ({ row }) => (
                <div>
                    {row.original.address.city}, {row.original.address.street}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.verifiedAt ? "active" : "pending";

                return (
                    <Badge
                        variant={status === "active" ? "default" : status === "pending" ? "outline" : "destructive"}
                        className="capitalize"
                    >
                        {status === "active" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {status === "pending" && <AlertCircle className="mr-1 h-3 w-3" />}
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return <div>{format(date, "MMM d, yyyy")}</div>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const pharmacy = row.original;

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onView(pharmacy._id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View details
                                </DropdownMenuItem>
                                {(onEdit && !isAdmin) && (
                                    <>
                                        <DropdownMenuItem onClick={() => onEdit(pharmacy._id)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                {onStatusChange && isAdmin && (
                                    <>
                                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => onStatusChange(pharmacy._id, "active")}
                                            disabled={pharmacy.verifiedAt !== null}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                            Set as Active
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onStatusChange(pharmacy._id, "pending")}
                                            disabled={pharmacy.verifiedAt === null}
                                        >
                                            <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                                            Set as Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                {!isAdmin && (
                                    <>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the pharmacy and all associated data
                                                        from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => onDelete(pharmacy._id)} className="bg-red-600 hover:bg-red-700">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    // Add the "Owner Email" column only if the user is an admin
    if (isAdmin) {
        baseColumns.splice(1, 0, {
            accessorKey: "userId",
            header: "Owner Email",
            cell: ({ row }) => (
                <div>
                    {row.original.userId.email}
                </div>
            ),
        });
    }

    return baseColumns;
};