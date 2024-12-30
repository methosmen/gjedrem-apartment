import { useLanguage } from "@/hooks/useLanguage";
import { FacilitiesSection } from "./FacilitiesSection";

export const InformationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">{t("nav.information")}</h2>
      <p className="text-lg leading-relaxed mb-8">{t("info.description")}</p>
      
      <FacilitiesSection />
    </section>
  );
};