"use client"

import * as React from "react"
import {CalendarIcon} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {FormControl} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {format} from "date-fns";

interface CustomDatePickerProps {
    date: Date | undefined;
    setDateAction: (date: Date | undefined) => void;
    isRequired: boolean;
    isDisable?: (date: Date) => boolean;
}

export function CustomDatePicker({date, setDateAction, isRequired = false, isDisable}: CustomDatePickerProps) {

    return (
        <div className="flex flex-col gap-3">
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date ? (
                                format(date, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDateAction}
                        required={isRequired}
                        disabled={(date) => isDisable ? isDisable(date) : false}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
