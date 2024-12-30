import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import {
  Tv,
  Utensils,
  ShowerHead,
  Wifi,
  Bath,
  Car,
  Bus,
  MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const facilities = [
    { icon: Tv, label: t("facilities.tv") },
    { icon: Utensils, label: t("facilities.kitchen") },
    { icon: ShowerHead, label: t("facilities.shower") },
    { icon: Wifi, label: t("facilities.wifi") },
    { icon: Bath, label: t("facilities.towels") },
  ];

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

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          startDate: date.from.toISOString().split('T')[0],
          endDate: date.to.toISOString().split('T')[0],
          email
        }
      });

      if (emailError) throw emailError;

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
        description: "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPhotos = async () => {
    const { data: apartmentFiles } = await supabase.storage
      .from('photos')
      .list('apartment', {
        sortBy: { column: 'name', order: 'asc' },
      });

    const { data: surroundingFiles } = await supabase.storage
      .from('photos')
      .list('surroundings', {
        sortBy: { column: 'name', order: 'asc' },
      });

    const getPhotoUrl = (path: string) => {
      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(path);
      return data.publicUrl;
    };

    const apartmentPhotos = (apartmentFiles || []).map(file => ({
      src: getPhotoUrl(`apartment/${file.name}`),
      alt: file.name.split('.')[0]
    }));

    const surroundingPhotos = (surroundingFiles || []).map(file => ({
      src: getPhotoUrl(`surroundings/${file.name}`),
      alt: file.name.split('.')[0]
    }));

    return {
      apartmentPhotos: apartmentPhotos.length ? apartmentPhotos : [{ src: "/placeholder.svg", alt: "Living Room" }],
      surroundingPhotos: surroundingPhotos.length ? surroundingPhotos : [{ src: "/placeholder.svg", alt: "Surroundings" }]
    };
  };

  const { data: photos = { apartmentPhotos: [], surroundingPhotos: [] } } = useQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Photo Galleries */}
      <section className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">{t("gallery.apartment")}</h2>
            <PhotoCarousel 
              photos={photos.apartmentPhotos} 
              className="max-w-xl mx-auto"
            />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">{t("gallery.surroundings")}</h2>
            <PhotoCarousel 
              photos={photos.surroundingPhotos}
              className="max-w-xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Booking Section */}
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

      {/* Information Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t("nav.information")}</h2>
        <p className="text-lg leading-relaxed mb-8">{t("info.description")}</p>
        
        {/* Facilities */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {facilities.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-accent/50"
            >
              <Icon className="w-6 h-6" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-8">{t("nav.prices")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries({
            weekly: ["prices.weekly", "prices.weekly_price"],
            daily: ["prices.daily", "prices.daily_price"],
            cleaning: ["prices.cleaning", "prices.cleaning_price"],
            bedding: ["prices.bedding", "prices.bedding_price"],
          }).map(([key, [labelKey, priceKey]]) => (
            <div
              key={key}
              className="p-6 rounded-lg bg-card shadow-lg"
            >
              <h3 className="font-semibold mb-2">{t(labelKey)}</h3>
              <p className="text-2xl font-bold">{t(priceKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t("nav.distances")}</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries({
            store: t("distances.store"),
            egersund: t("distances.egersund"),
            stavanger: t("distances.stavanger"),
          }).map(([key, distance]) => (
            <div
              key={key}
              className="flex items-center gap-4 p-4 rounded-lg bg-accent/50"
            >
              <MapPin className="w-6 h-6 flex-shrink-0" />
              <span>{distance}</span>
            </div>
          ))}
        </div>

        {/* Transport & Parking */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg bg-card shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Car className="w-6 h-6" />
              <h3 className="text-xl font-bold">{t("parking.title")}</h3>
            </div>
            <p>{t("parking.description")}</p>
          </div>
          <div className="p-6 rounded-lg bg-card shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Bus className="w-6 h-6" />
              <h3 className="text-xl font-bold">{t("transport.title")}</h3>
            </div>
            <p>{t("transport.description")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;