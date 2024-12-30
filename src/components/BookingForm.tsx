import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Label } from "@/components/ui/label";
import { CalendarX, Calendar as CalendarIcon, CheckCircle } from "lucide-react";

export const BookingForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);

  // Fetch occupied dates
  const fetchOccupiedDates = async () => {
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
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
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
      // Insert booking request into database
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

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          startDate: date.from.toISOString().split('T')[0],
          endDate: date.to.toISOString().split('T')[0],
          email,
          name,
          phone,
          comment,
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

      // Reset form
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
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <CalendarX className="w-4 h-4 text-destructive" />
                <span>{t('booking.legend.occupied')}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>{t('booking.legend.selected')}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{t('booking.legend.today')}</span>
              </div>
            </div>
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              className="rounded-md border bg-background"
              disabled={{ before: new Date(), dates: occupiedDates }}
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
          <div className="space-y-2">
            <Label htmlFor="name">{t('booking.name')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('booking.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('booking.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">{t('booking.comment')}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
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