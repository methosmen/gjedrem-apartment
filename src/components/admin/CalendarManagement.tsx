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
    console.log('Henter opptatte datoer...');
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Feil ved henting av opptatte datoer:', error);
      return;
    }

    const dateStatusMap = new Map<string, string>();
    
    data.forEach(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (!dateStatusMap.has(dateStr)) {
          dateStatusMap.set(dateStr, booking.status);
        }
      }
    });

    const occupiedDatesArray: Date[] = [];
    dateStatusMap.forEach((status, dateStr) => {
      if (status === 'occupied') {
        occupiedDatesArray.push(new Date(dateStr));
      }
    });
    
    console.log('Admin - Opptatte datoer:', occupiedDatesArray);
    setOccupiedDates(occupiedDatesArray);
  };

  const handleDateRangeSelect = async () => {
    if (!date?.from || !date?.to) return;

    try {
      console.log('Legger til booking med status:', status);
      const { error } = await supabase
        .from('bookings')
        .insert([
          { 
            start_date: date.from.toISOString().split('T')[0], 
            end_date: date.to.toISOString().split('T')[0], 
            status 
          }
        ]);

      if (error) throw error;

      toast({
        title: "Suksess",
        description: "Datoperiode oppdatert",
      });
      
      await fetchOccupiedDates();
      
      setDate({
        from: new Date(),
        to: undefined
      });
    } catch (error: any) {
      console.error('Feil ved oppdatering av datoperiode:', error);
      toast({
        title: "Feil",
        description: error.message || "Kunne ikke oppdatere datoperiode",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Kalenderadministrasjon</h2>
      <div className="space-y-4">
        <Select value={status} onValueChange={(value: 'occupied' | 'available') => setStatus(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Velg status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="occupied">Sett som opptatt</SelectItem>
            <SelectItem value="available">Sett som tilgjengelig</SelectItem>
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
              backgroundColor: "#ea384c",
              color: "white",
              fontWeight: "bold"
            }
          }}
        />
        <Button 
          onClick={handleDateRangeSelect}
          className="w-full"
          disabled={!date?.from || !date?.to}
        >
          Oppdater datoperiode
        </Button>
      </div>
    </section>
  );
};