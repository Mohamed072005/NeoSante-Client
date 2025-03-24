"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Pill, Plus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons/icons"
import {Product, productFormSchema, type ProductFormValues} from "@/lib/types/product"
import {Category} from "@/lib/types/category";

interface ProductFormProps {
    initialValues?: Product
    onSubmit: (data: ProductFormValues) => Promise<void>
    isLoading?: boolean
    submitLabel?: string
    pharmacies: { _id: string; name: string }[]
    categories: Category[]
}

export function ProductForm({initialValues, onSubmit, isLoading = false, submitLabel = "Submit", pharmacies, categories,}: ProductFormProps) {
    const { toast } = useToast()
    const [localLoading, setLocalLoading] = useState(false)
    const [alternatives, setAlternatives] = useState<string[]>(initialValues?.alternatives || [])
    const [alternativeInput, setAlternativeInput] = useState("")

    // Initialize the form
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: initialValues?.name || "",
            description: initialValues?.description || "",
            pharmacyId: initialValues?.pharmacyId?._id || (pharmacies.length > 0 ? pharmacies[0]._id : ""),
            image: initialValues?.image || "",
            stock: initialValues?.stock || 0,
            barcode: initialValues?.barcode || "",
            genericName: initialValues?.genericName || "",
            categoryId: initialValues?.category?._id || (categories.length > 0 ? categories[0]._id : ""),
            requiresPrescription: initialValues?.requiresPrescription || false,
            alternatives: initialValues?.alternatives || [],
        },
    })

    // Handle image upload (mock function - replace with actual upload logic)
    const handleImageUpload = async (file: File) => {
        setLocalLoading(true)
        try {
            // Mock image upload - replace with actual upload to your backend/storage
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock image URL - replace with actual URL from your upload service
            const imageUrl = URL.createObjectURL(file)

            // Set the image URL in the form
            form.setValue("image", imageUrl, { shouldValidate: true })

            toast({
                title: "Image uploaded",
                description: "Your image has been uploaded successfully.",
            })
        } catch (error: unknown) {
            toast({
                title: "Upload failed",
                description: "There was an error uploading your image. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLocalLoading(false)
        }
    }

    const addAlternative = () => {
        if (alternativeInput.trim() && !alternatives.includes(alternativeInput.trim())) {
            const newAlternatives = [...alternatives, alternativeInput.trim()]
            setAlternatives(newAlternatives)
            form.setValue("alternatives", newAlternatives)
            setAlternativeInput("")
        }
    }

    const removeAlternative = (index: number) => {
        const newAlternatives = alternatives.filter((_, i) => i !== index)
        setAlternatives(newAlternatives)
        form.setValue("alternatives", newAlternatives)
    }

    // Handle form submission
    const handleSubmit = async (data: ProductFormValues) => {
        try {
            await onSubmit(data)
        } catch (error) {
            console.error("Form submission error:", error)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="genericName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Generic Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter generic name (optional)" {...field} />
                                        </FormControl>
                                        <FormDescription>The non-branded name of the medication</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description *</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter product description" className="min-h-[120px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {!initialValues?.name && (
                                <FormField
                                    control={form.control}
                                    name="pharmacyId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pharmacy *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select pharmacy" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {pharmacies.map((pharmacy) => (
                                                        <SelectItem key={pharmacy._id} value={pharmacy._id}>
                                                            {pharmacy.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.category_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Product Image</h2>
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="product-image"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            handleImageUpload(file)
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="product-image"
                                                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                    <span>Upload Image</span>
                                                </label>
                                                {field.value && (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => form.setValue("image", "")}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            {field.value && (
                                                <div className="relative w-full max-w-[300px] h-[200px] rounded-md overflow-hidden border">
                                                    <img
                                                        src={field.value || "/placeholder.svg"}
                                                        alt="Product"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Inventory Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Inventory Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Enter stock quantity"
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="barcode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barcode *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter barcode" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="requiresPrescription"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Requires Prescription</FormLabel>
                                        <FormDescription>Toggle if this product requires a prescription for purchase</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Alternatives */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Alternative Products (Optional)</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Add alternative product name"
                                    value={alternativeInput}
                                    onChange={(e) => setAlternativeInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            addAlternative()
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addAlternative} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </div>

                            {alternatives.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {alternatives.map((alt, index) => (
                                        <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                                            <Pill className="h-3 w-3" />
                                            <span>{alt}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0 rounded-full"
                                                onClick={() => removeAlternative(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 transform transition duration-150 ease-in-out hover:scale-105"
                            disabled={isLoading || localLoading}
                        >
                            {(isLoading || localLoading) && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            {submitLabel}
                        </Button>
                    </div>
                </form>
            </Form>
        </motion.div>
    )
}