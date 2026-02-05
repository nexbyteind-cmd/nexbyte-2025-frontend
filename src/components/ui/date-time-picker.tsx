import * as React from "react";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Initial time state derived from date or defaults
    const [selectedTime, setSelectedTime] = React.useState<{
        hour: number;
        minute: number;
        ampm: "AM" | "PM";
    }>({
        hour: date ? parseInt(format(date, "h")) : 12,
        minute: date ? parseInt(format(date, "m")) : 0,
        ampm: date ? (format(date, "a") as "AM" | "PM") : "AM",
    });

    // Sync internal time state when external date changes
    React.useEffect(() => {
        if (date) {
            setSelectedTime({
                hour: parseInt(format(date, "h")),
                minute: parseInt(format(date, "m")),
                ampm: format(date, "a") as "AM" | "PM",
            });
        }
    }, [date]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            setDate(undefined);
            return;
        }

        // Apply currently selected time to the new date
        const newDate = new Date(selectedDate);
        let hour24 = selectedTime.hour;
        if (selectedTime.ampm === "PM" && hour24 !== 12) hour24 += 12;
        if (selectedTime.ampm === "AM" && hour24 === 12) hour24 = 0;

        newDate.setHours(hour24);
        newDate.setMinutes(selectedTime.minute);

        setDate(newDate);
    };

    const handleTimeChange = (
        type: "hour" | "minute" | "ampm",
        value: number | "AM" | "PM"
    ) => {
        const newTime = { ...selectedTime, [type]: value };
        setSelectedTime(newTime as any);

        if (date) {
            const newDate = new Date(date);
            let hour24 = newTime.hour;
            if (newTime.ampm === "PM" && hour24 !== 12) hour24 += 12;
            if (newTime.ampm === "AM" && hour24 === 12) hour24 = 0;

            newDate.setHours(hour24);
            newDate.setMinutes(newTime.minute);
            setDate(newDate);
        }
    };

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal bg-slate-50 border-input",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP p") : <span>Pick a date & time</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x">
                    <div className="p-2 sm:p-3">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                    </div>
                    <div className="flex flex-col p-2 sm:p-3 gap-2 w-full sm:w-64">
                        <div className="text-xs sm:text-sm font-medium mb-1 text-center">Time</div>
                        <div className="flex h-[200px] sm:h-[280px] divide-x border rounded-md">
                            {/* Hours */}
                            <ScrollArea className="flex-1 h-full">
                                <div className="p-2 flex flex-col items-center gap-1">
                                    {hours.map((h) => (
                                        <Button
                                            key={h}
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "w-full shrink-0 aspect-square font-normal",
                                                selectedTime.hour === h && "bg-primary text-primary-foreground"
                                            )}
                                            onClick={() => handleTimeChange("hour", h)}
                                        >
                                            {h}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Minutes */}
                            <ScrollArea className="flex-1 h-full">
                                <div className="p-2 flex flex-col items-center gap-1">
                                    {minutes.map((m) => (
                                        <Button
                                            key={m}
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "w-full shrink-0 aspect-square font-normal",
                                                selectedTime.minute === m && "bg-primary text-primary-foreground"
                                            )}
                                            onClick={() => handleTimeChange("minute", m)}
                                        >
                                            {m.toString().padStart(2, "0")}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* AM/PM */}
                            <div className="flex flex-col flex-1 p-2 gap-1 border-l items-center justify-center bg-slate-50">
                                {["AM", "PM"].map((ampm) => (
                                    <Button
                                        key={ampm}
                                        variant={selectedTime.ampm === ampm ? "default" : "outline"}
                                        size="sm"
                                        className="w-full text-xs"
                                        onClick={() => handleTimeChange("ampm", ampm as "AM" | "PM")}
                                    >
                                        {ampm}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <Button size="sm" className="mt-2 w-full" onClick={() => setIsOpen(false)}>
                            Done
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
