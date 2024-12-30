import { useLanguage } from "@/hooks/useLanguage";
import { FacilitiesSection } from "./FacilitiesSection";
import { Fish } from "lucide-react";

export const InformationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-accent/50 p-6 rounded-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Fish className="w-6 h-6" />
          <h3 className="text-xl font-semibold">{t("fishing.title")}</h3>
        </div>
        <p className="text-lg leading-relaxed mb-4">{t("fishing.description")}</p>
        <p className="text-lg leading-relaxed">{t("fishing.zone")}</p>
      </div>

      <h2 className="text-3xl font-bold mb-8">{t("nav.information")}</h2>
      <p className="text-lg leading-relaxed mb-8">{t("info.description")}</p>
      
      <FacilitiesSection />
    </section>
  );
};