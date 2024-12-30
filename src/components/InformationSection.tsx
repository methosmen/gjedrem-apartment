import { useLanguage } from "@/hooks/useLanguage";
import { FacilitiesSection } from "./FacilitiesSection";

export const InformationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">{t("nav.information")}</h2>
      <p className="text-lg leading-relaxed mb-8">{t("info.description")}</p>
      
      <FacilitiesSection />

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
  );
};