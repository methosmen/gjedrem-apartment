import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CalendarManagement = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined
  });
  const [status, setStatus] = useState<'occupied' | 'available'>('occupied');

  const handleDateRangeSelect = async () => {
    if (!date?.from || !date?.to) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          { 
            start_date: date.from.toISOString().split('T')[0], 
            end_date: date.to.toISOString().split('T')[0], 
            status: status 
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Date range updated successfully",
      });
      
      // Reset selection after successful update
      setDate({
        from: new Date(),
        to: undefined
      });
    } catch (error) {
      console.error('Error updating date range:', error);
      toast({
        title: "Error",
        description: "Failed to update date range",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Calendar Management</h2>
      <div className="space-y-4">
        <Select value={status} onValueChange={(value: 'occupied' | 'available') => setStatus(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="occupied">Set as Occupied</SelectItem>
            <SelectItem value="available">Set as Available</SelectItem>
          </SelectContent>
        </Select>
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <Button 
          onClick={handleDateRangeSelect}
          className="w-full"
          disabled={!date?.from || !date?.to}
        >
          Update Date Range
        </Button>
      </div>
    </section>
  );
};