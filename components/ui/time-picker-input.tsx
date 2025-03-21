"use client"

import type * as React from "react"
import { Input } from "@/components/ui/input"

interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string
    onChange: (value: string) => void
}

export function TimePickerInput({ value, onChange, className, ...props }: TimePickerInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        onChange(newValue)
    }

    return <Input type="time" value={value} onChange={handleChange} className={className} {...props} />
}