"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"
import { Eye, Edit, Trash2, MoreHorizontal, Pill, Save } from "lucide-react"
import type { Product } from "@/lib/types/product"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProductColumnsProps {
    onDelete: (id: string) => void
    onUpdateStock: (id: string, stock: number) => void
    onView: (id: string) => void
    onEdit: (id: string) => void
    editingStockId: string | null
    setEditingStockId: (id: string | null) => void
    tempStockValue: string
    setTempStockValue: (value: string) => void
}

interface StockCellProps {
    product: Product
    editingStockId: string | null
    setEditingStockId: (id: string | null) => void
    tempStockValue: string
    setTempStockValue: (value: string) => void
    onUpdateStock: (id: string, stock: number) => void
}

const StockCell = ({product, editingStockId, setEditingStockId, tempStockValue, setTempStockValue, onUpdateStock}: StockCellProps) => {
    const isEditing = editingStockId === product._id

    const handleSave = () => {
        const newStock = Number.parseInt(tempStockValue)
        if (!isNaN(newStock) && newStock >= 0) {
            onUpdateStock(product._id, newStock)
        }
        setEditingStockId(null)
    }

    const handleStartEditing = () => {
        setEditingStockId(product._id)
        setTempStockValue(product.stock.toString())
    }

    const handleCancel = () => {
        setEditingStockId(null)
    }

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        min="0"
                        value={tempStockValue}
                        onChange={(e) => setTempStockValue(e.target.value)}
                        className="h-8 w-20"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSave()
                            } else if (e.key === "Escape") {
                                handleCancel()
                            }
                        }}
                        autoFocus
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="cursor-pointer hover:underline" onClick={handleStartEditing}>
                    <Badge
                        variant={product.stock === 0 ? "destructive" : product.stock <= 10 ? "outline" : "default"}
                        className="text-xs font-normal"
                    >
                        {product.stock}
                    </Badge>
                </div>
            )}
        </div>
    )
}

export const ProductColumns = ({onDelete, onUpdateStock, onView, onEdit, editingStockId, setEditingStockId, tempStockValue, setTempStockValue}: ProductColumnsProps): ColumnDef<Product>[] => [
    {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => {
            const product = row.original
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-md">
                        <AvatarImage src={product.image} alt={product.name} className="object-cover" />
                        <AvatarFallback className="rounded-md bg-primary/10">
                            <Pill className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        {product.genericName && <span className="text-xs text-muted-foreground">{product.genericName}</span>}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <div>{row.original.category.category_name}</div>,
    },
    {
        accessorKey: "pharmacy",
        header: "Pharmacy",
        cell: ({ row }) => <div>{row.original.pharmacyId.name}</div>,
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const product = row.original
            return (
                <StockCell
                    product={product}
                    editingStockId={editingStockId}
                    setEditingStockId={setEditingStockId}
                    tempStockValue={tempStockValue}
                    setTempStockValue={setTempStockValue}
                    onUpdateStock={onUpdateStock}
                />
            )
        },
    },
    {
        accessorKey: "requiresPrescription",
        header: "Prescription",
        cell: ({ row }) => {
            const requiresPrescription = row.getValue("requiresPrescription") as boolean
            return (
                <div className="flex justify-start">
                    {requiresPrescription ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Required
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Not Required
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "lastStockUpdate",
        header: "Last Stock Update",
        cell: ({ row }) => {
            const dateValue = row.getValue("lastStockUpdate");
            const date = dateValue ? new Date(dateValue) : null;

            if (!date || isNaN(date.getTime())) {
                return <div className="text-sm">No updates</div>;
            }

            return <div className="text-sm">{format(date, "MMM d, yyyy")}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original

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
                            <DropdownMenuItem onClick={() => onView(product._id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(product._id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
                                            This action cannot be undone. This will permanently delete the product and remove it from your
                                            inventory.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDelete(product._id)} className="bg-red-600 hover:bg-red-700">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]