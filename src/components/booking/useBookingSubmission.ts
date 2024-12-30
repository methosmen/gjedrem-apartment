import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface BookingData {
  date: DateRange | undefined;
  name: string;
  email: string;
  phone: string;
  comment: string;
}

export const useBookingSubmission = (onSuccess: () => void) => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async ({ date, name, email, phone, comment }: BookingData) => {
    if (!date?.from || !date?.to || !email || !name) {
      toast({
        title: "Error",
        description: `${t('booking.name')} & ${t('booking.email')} ${t('booking.required')}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            start_date: date.from.toISOString().split('T')[0],
            end_date: date.to.toISOString().split('T')[0],
            status: 'requested'
          }
        ]);

      if (bookingError) throw bookingError;

      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          startDate: date.from.toISOString().split('T')[0],
          endDate: date.to.toISOString().split('T')[0],
          email,
          name,
          phone,
          comment,
          language,
          fromEmail: 'onboarding@resend.dev'
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        throw new Error('Failed to send confirmation email');
      }

      toast({
        title: t('booking.confirmation.title'),
        description: t('booking.confirmation.message'),
      });

      onSuccess();
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleBooking, isSubmitting };
};