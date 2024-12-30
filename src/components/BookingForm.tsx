import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { useLanguage } from "@/hooks/useLanguage";
import { BookingFields } from "./booking/BookingFields";
import { BookingCalendar } from "./booking/BookingCalendar";
import { useOccupiedDates } from "./booking/useOccupiedDates";
import { useBookingSubmission } from "./booking/useBookingSubmission";

export const BookingForm = () => {
  const { t } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  
  const { occupiedDates, fetchOccupiedDates } = useOccupiedDates();
  const { handleBooking, isSubmitting } = useBookingSubmission(() => {
    setDate(undefined);
    setName("");
    setEmail("");
    setPhone("");
    setComment("");
    fetchOccupiedDates();
  });

  const onSubmit = () => {
    handleBooking({ date, name, email, phone, comment });
  };

  return (
    <section className="container mx-auto px-4 py-16 bg-accent/10 rounded-lg">
      <h2 className="text-3xl font-bold mb-8">{t('booking.title')}</h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <BookingCalendar
            date={date}
            setDate={setDate}
            occupiedDates={occupiedDates}
          />
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
            onClick={onSubmit}
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