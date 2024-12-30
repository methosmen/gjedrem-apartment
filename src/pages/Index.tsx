import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { PhotoCarousel } from "@/components/PhotoCarousel";
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

const Index = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

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

  // Temporary photo data - will be replaced with actual photos from admin uploads
  const apartmentPhotos = [
    { src: "/placeholder.svg", alt: "Living Room" },
    { src: "/placeholder.svg", alt: "Kitchen" },
    { src: "/placeholder.svg", alt: "Bedroom" },
  ];

  const surroundingPhotos = [
    { src: "/placeholder.svg", alt: "Surroundings 1" },
    { src: "/placeholder.svg", alt: "Surroundings 2" },
    { src: "/placeholder.svg", alt: "Surroundings 3" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 relative h-[80vh]">
        <PhotoCarousel 
          photos={[apartmentPhotos[0]]}
          className="h-full"
        />
      </section>

      {/* Photo Galleries */}
      <section className="container mx-auto px-4 py-16 space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">{t("gallery.apartment")}</h2>
          <PhotoCarousel photos={apartmentPhotos} />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-6">{t("gallery.surroundings")}</h2>
          <PhotoCarousel photos={surroundingPhotos} />
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

        {/* Prices */}
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