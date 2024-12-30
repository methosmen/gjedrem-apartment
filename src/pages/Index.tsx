import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { PhotoGallery } from "@/components/PhotoGallery";
import { BookingForm } from "@/components/BookingForm";
import { InformationSection } from "@/components/InformationSection";
import { LocationSection } from "@/components/LocationSection";

const Index = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <PhotoGallery />
      <BookingForm />
      <InformationSection />
      <LocationSection />
    </div>
  );
};

export default Index;