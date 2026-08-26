import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React from "react";

interface SelectFilterProps {
    items: string[]
    label: string
    defaultValue: string
    value: string
    setValue: (value: string) => void
}
export default function SelectFilter({items, label, defaultValue, value, setValue}: SelectFilterProps) {
    return (
        <div className="w-44 bg-background">
            <Select
                value={value}
                onValueChange={(value) => setValue(value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder={label}/>
                </SelectTrigger>
                <SelectContent>
                    {!items.includes(defaultValue) && (
                        <SelectItem value={defaultValue}>{defaultValue}</SelectItem>
                    )}
                    {items.map((item, index) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}