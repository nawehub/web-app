// components/ui/custom-combobox.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CustomComboboxProps<T> {
	data: T[]
	searchField: keyof T
	displayField: keyof T
	valueField: keyof T
	value: string
	onSelectAction: (value: string) => void
	placeholder?: string
	emptyText?: string
	searchPlaceholder?: string
	className?: string
}

export function CustomCombobox<T>({
	data,
	searchField,
	displayField,
	valueField,
	value,
	onSelectAction,
	placeholder = "Select item...",
	emptyText = "No items found.",
	searchPlaceholder = "Search...",
	className,
}: CustomComboboxProps<T>) {
	const [open, setOpen] = React.useState(false)

	const selectedItem = data.find((item) => String(item[valueField]) === value)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("w-full justify-between", className)}
				>
					{selectedItem ? (
						<span>{String(selectedItem[displayField])}</span>
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandEmpty>{emptyText}</CommandEmpty>
					<CommandGroup>
						<ScrollArea className={'h-72 w-full overflow-y-auto'}>
							{data.map((item) => (
								<CommandItem
									key={String(item[valueField])}
									value={String(item[searchField])}
									onSelect={(currentValue) => {
										const selected = data.find(
											(i) => String(i[searchField]).toLowerCase() === currentValue.toLowerCase()
										)
										onSelectAction(String(selected?.[valueField] ?? ""))
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === String(item[valueField]) ? "opacity-100" : "opacity-0"
										)}
									/>
									{String(item[displayField])}
								</CommandItem>
							))}
						</ScrollArea>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}