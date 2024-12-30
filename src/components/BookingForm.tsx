import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";

export const BookingForm = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!date?.from || !date?.to || !email) {
      toast({
        title: "Error",
        description: "Please select dates and enter your email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert booking into database
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            start_date: date.from.toISOString().split('T')[0],
            end_date: date.to.toISOString().split('T')[0],
            status: 'occupied'
          }
        ]);

      if (bookingError) throw bookingError;

      // Send confirmation email using resend's default domain
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          startDate: date.from.toISOString().split('T')[0],
          endDate: date.to.toISOString().split('T')[0],
          email,
          fromEmail: 'onboarding@resend.dev' // Using Resend's default domain
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        throw new Error('Failed to send confirmation email');
      }

      toast({
        title: "Success",
        description: "Booking confirmed! Check your email for details.",
      });

      // Reset form
      setDate(undefined);
      setEmail("");
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
      <h2 className="text-3xl font-bold mb-8">Book Your Stay</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            className="rounded-md border bg-background"
            disabled={{ before: new Date() }}
          />
        </div>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={handleBooking}
            disabled={isSubmitting || !date?.from || !date?.to || !email}
            className="w-full"
          >
            {isSubmitting ? "Processing..." : "Book Now"}
          </Button>
        </div>
      </div>
    </section>
  );
};