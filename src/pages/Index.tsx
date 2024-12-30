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
      <div className="bg-accent/50 p-6 rounded-lg container mx-auto px-4 mt-8">
        <InformationSection />
      </div>
      <PhotoGallery />
      <LocationSection />
      <BookingForm />
    </div>
  );
};

export default Index;