import { useState, useEffect } from "react";
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
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);

  useEffect(() => {
    fetchOccupiedDates();
  }, []);

  const fetchOccupiedDates = async () => {
    console.log('Fetching occupied dates...');
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('status', 'occupied');

    if (error) {
      console.error('Error fetching occupied dates:', error);
      return;
    }

    const dates: Date[] = [];
    data.forEach(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    
    console.log('Admin - Occupied dates:', dates);
    setOccupiedDates(dates);
  };

  const handleDateRangeSelect = async () => {
    if (!date?.from || !date?.to) return;

    try {
      console.log('Inserting booking with status:', status);
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
      
      // Refresh occupied dates after update
      await fetchOccupiedDates();
      
      // Reset selection after successful update
      setDate({
        from: new Date(),
        to: undefined
      });
    } catch (error: any) {
      console.error('Error updating date range:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update date range",
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
          modifiers={{
            occupied: occupiedDates
          }}
          modifiersStyles={{
            occupied: { 
              backgroundColor: "var(--destructive)",
              color: "var(--destructive-foreground)"
            }
          }}
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