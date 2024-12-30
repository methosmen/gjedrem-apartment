import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Admin = () => {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">{t("admin.title")}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Photo Management */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("admin.photos")}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">{t("gallery.apartment")}</h3>
                <Button>{t("admin.uploadPhotos")}</Button>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">{t("gallery.surroundings")}</h3>
                <Button>{t("admin.uploadPhotos")}</Button>
              </div>
            </div>
          </section>

          {/* Calendar Management */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">{t("admin.calendar")}</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Admin;