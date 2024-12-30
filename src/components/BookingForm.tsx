import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { CalendarLegend } from "./calendar/CalendarLegend";
import { BookingFields } from "./booking/BookingFields";

export const BookingForm = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);

  useEffect(() => {
    fetchOccupiedDates();
  }, []);

  const fetchOccupiedDates = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .in('status', ['occupied', 'requested']);

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
    setOccupiedDates(dates);
  };

  const handleBooking = async () => {
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

      setDate(undefined);
      setName("");
      setEmail("");
      setPhone("");
      setComment("");
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

  return (
    <section className="container mx-auto px-4 py-16 bg-accent/10 rounded-lg">
      <h2 className="text-3xl font-bold mb-8">{t('booking.title')}</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="bg-background p-4 rounded-lg space-y-2">
            <CalendarLegend />
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              className="rounded-md border bg-background"
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
                  backgroundColor: "var(--destructive)",
                  color: "var(--destructive-foreground)"
                }
              }}
            />
          </div>
        </div>
        <div className="space-y-4">
          <BookingFields
            name={name}
            email={email}
            phone={phone}
            comment={comment}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onCommentChange={setComment}
          />
          <Button 
            onClick={handleBooking}
            disabled={isSubmitting || !date?.from || !date?.to || !email || !name}
            className="w-full"
          >
            {isSubmitting ? "..." : t('booking.submit')}
          </Button>
        </div>
      </div>
    </section>
  );
};