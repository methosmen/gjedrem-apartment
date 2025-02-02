import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { CalendarLegend } from "../calendar/CalendarLegend";

interface BookingCalendarProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  occupiedDates: Date[];
}

export const BookingCalendar = ({ date, setDate, occupiedDates }: BookingCalendarProps) => {
  return (
    <div className="bg-background p-4 rounded-lg space-y-2">
      <CalendarLegend />
      <Calendar
        mode="range"
        selected={date}
        onSelect={setDate}
        className="rounded-md border bg-background"
        weekStartsOn={1}
        disabled={(date: Date) => {
          return date < new Date() || occupiedDates.some(occupiedDate => 
            occupiedDate.getFullYear() === date.getFullYear() &&
            occupiedDate.getMonth() === date.getMonth() &&
            occupiedDate.getDate() === date.getDate()
          );
        }}
        modifiers={{
          occupied: occupiedDates
        }}
        modifiersStyles={{
          occupied: { 
            backgroundColor: "#ea384c",
            color: "white",
            fontWeight: "bold"
          }
        }}
      />
    </div>
  );
};