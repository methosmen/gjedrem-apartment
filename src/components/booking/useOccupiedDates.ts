import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useOccupiedDates = () => {
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);

  const fetchOccupiedDates = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching occupied dates:', error);
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
    
    console.log('Booking Form - Occupied dates:', occupiedDatesArray);
    setOccupiedDates(occupiedDatesArray);
  };

  useEffect(() => {
    fetchOccupiedDates();
  }, []);

  return { occupiedDates, fetchOccupiedDates };
};