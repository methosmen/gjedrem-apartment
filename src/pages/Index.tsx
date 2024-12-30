import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
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
      <InformationSection />
      <LocationSection />
      <BookingForm />
    </div>
  );
};

export default Index;