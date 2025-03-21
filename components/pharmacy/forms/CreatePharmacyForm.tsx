"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Building2, Plus, Trash2, Upload, X, Calendar, Award } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons/icons"
import {TimePickerInput} from "@/components/ui/time-picker-input";

export const pharmacyFormSchema = z.object({
    name: z.string().min(2, { message: "Pharmacy name must be at least 2 characters" }),
    address: z
        .object({
            city: z.string().min(2, { message: "City is required" }),
            street: z.string().min(2, { message: "Street address is required" }),
        }),
    image: z.string().min(1, { message: "Pharmacy image is required" }),
    workingHours: z.object({
        monday: z.object({ open: z.string(), close: z.string() }),
        tuesday: z.object({ open: z.string(), close: z.string() }),
        wednesday: z.object({ open: z.string(), close: z.string() }),
        thursday: z.object({ open: z.string(), close: z.string() }),
        friday: z.object({ open: z.string(), close: z.string() }),
        saturday: z.object({ open: z.string(), close: z.string() }),
        sunday: z.object({ open: z.string(), close: z.string() }),
    }),
    certifications: z
        .array(
            z.object({
                name: z.string().min(2, { message: "Certification name is required" }),
                image: z.string().min(1, { message: "Certification image is required" }),
                date: z
                    .string()
                    .min(1, { message: "Issue date is required" })
                    .refine(
                        (value) => {
                            const selectedDate = new Date(value);
                            const currentDate = new Date();
                            return selectedDate < currentDate;
                        },
                        { message: "Date must be in the past" }
                    ),
            }),
        )
        .min(1, { message: "At least one certification is required" }),
})

export type PharmacyFormValues = z.infer<typeof pharmacyFormSchema>

interface PharmacyFormProps {
    initialValues?: Partial<PharmacyFormValues>
    onSubmit: (data: PharmacyFormValues) => Promise<void>
    isLoading?: boolean
    submitLabel?: string
    showTitle?: boolean
}

export function PharmacyForm({initialValues, onSubmit, isLoading = false, submitLabel = "Submit", showTitle = true,}: PharmacyFormProps) {
    const { toast } = useToast()
    const [localLoading, setLocalLoading] = useState(false)
    console.log(initialValues);

    // Initialize the form
    const form = useForm<PharmacyFormValues>({
        resolver: zodResolver(pharmacyFormSchema),
        defaultValues: {
            name: initialValues?.name || "",
            address: {
                city: initialValues?.address?.city || "",
                street: initialValues?.address?.street || "",
            },
            image: initialValues?.image || "",
            workingHours: initialValues?.workingHours || {
                monday: { open: "09:00", close: "18:00" },
                tuesday: { open: "09:00", close: "18:00" },
                wednesday: { open: "09:00", close: "18:00" },
                thursday: { open: "09:00", close: "18:00" },
                friday: { open: "09:00", close: "18:00" },
                saturday: { open: "09:00", close: "18:00" },
                sunday: { open: "09:00", close: "18:00" },
            },
            certifications: initialValues?.certifications || [{ name: "", image: "", date: "" }],
        },
    })

    // Setup field arrays for certifications and helpers
    const {
        fields: certificationFields,
        append: appendCertification,
        remove: removeCertification,
    } = useFieldArray({ control: form.control, name: "certifications" })

    // Handle image upload (mock function - replace with actual upload logic)
    const handleImageUpload = async (file: File, fieldPath: string) => {
        setLocalLoading(true)
        try {
            // Mock image upload - replace with actual upload to your backend/storage
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Mock image URL - replace with actual URL from your upload service
            const imageUrl = URL.createObjectURL(file)

            // Set the image URL in the form
            form.setValue(fieldPath as any, imageUrl, { shouldValidate: true })

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

    // Handle form submission
    const handleSubmit = async (data: PharmacyFormValues) => {
        await onSubmit(data)
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {showTitle && (
                <div className="flex items-center gap-2 mb-8">
                    <Building2 className="h-8 w-8 text-green-600" />
                    <h1 className="text-3xl font-bold">Pharmacy Registration</h1>
                </div>
            )}

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
                                        <FormLabel>Pharmacy Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter pharmacy name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pharmacy Image *</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="pharmacy-image"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) {
                                                                handleImageUpload(file, "image")
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="pharmacy-image"
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
                                                    <div className="relative w-full h-40 mt-2 rounded-md overflow-hidden">
                                                        <img
                                                            src={field.value || "/placeholder.svg"}
                                                            alt="Pharmacy"
                                                            className="w-full h-full object-cover"
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
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="address.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter city" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address.street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter street address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {initialValues && (
                        <>
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Working Hours</h2>
                                <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-muted/20">
                                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                                        <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                            <div className="font-medium capitalize">{day}</div>
                                            <FormField
                                                control={form.control}
                                                name={`workingHours.${day}.open` as any}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex items-center gap-2">
                                                            <FormLabel className="w-20">Open</FormLabel>
                                                            <FormControl>
                                                                <TimePickerInput value={field.value} onChange={field.onChange} className="w-full" />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`workingHours.${day}.close` as any}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex items-center gap-2">
                                                            <FormLabel className="w-20">Close</FormLabel>
                                                            <FormControl>
                                                                <TimePickerInput value={field.value} onChange={field.onChange} className="w-full" />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Certifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Certifications *</h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendCertification({ name: "", image: "", date: "" })}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Certification
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {certificationFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-lg bg-muted/20">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium flex items-center">
                                            <Award className="h-4 w-4 mr-2" />
                                            Certification {index + 1}
                                        </h3>
                                        {index > 0 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name={`certifications.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Certification Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Pharmacy License" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`certifications.${index}.date`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Issue Date *</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground",
                                                                    )}
                                                                >
                                                                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <FormField
                                            control={form.control}
                                            name={`certifications.${index}.image`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Certification Image *</FormLabel>
                                                    <FormControl>
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    id={`cert-image-${index}`}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0]
                                                                        if (file) {
                                                                            handleImageUpload(file, `certifications.${index}.image`)
                                                                        }
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`cert-image-${index}`}
                                                                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                                                                >
                                                                    <Upload className="h-4 w-4" />
                                                                    <span>Upload Certificate</span>
                                                                </label>
                                                                {field.value && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => form.setValue(`certifications.${index}.image`, "")}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            {field.value && (
                                                                <div className="relative w-full h-32 mt-2 rounded-md overflow-hidden">
                                                                    <img
                                                                        src={field.value || "/placeholder.svg"}
                                                                        alt="Certification"
                                                                        className="w-full h-full object-cover"
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Helpers (Optional) */}

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