
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthYearPickerProps {
  field: ControllerRenderProps<any, any>;
}

export function MonthYearPicker({ field }: MonthYearPickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
      if (field.value && !isNaN(new Date(field.value).getTime())) {
          return new Date(field.value);
      }
      return undefined;
  });
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // CRITICAL FIX: Implement null-safe date handling.
    // If the field value is falsy (null, undefined, empty string), set date to undefined.
    if (!field.value) {
        setDate(undefined);
        return;
    }

    const fieldDate = new Date(field.value);

    // If the parsed date is invalid, also set to undefined to prevent crash.
    if (isNaN(fieldDate.getTime())) {
        setDate(undefined);
        return;
    }

    // Only update state if the date has actually changed.
    if (date?.getTime() !== fieldDate.getTime()) {
      setDate(fieldDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);


  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      field.onChange(format(selectedDate, "MMMM yyyy"));
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={1980}
          toYear={new Date().getFullYear() + 5}
        />
      </PopoverContent>
    </Popover>
  );
}
