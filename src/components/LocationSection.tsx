import { useLanguage } from "@/hooks/useLanguage";
import { MapPin, Car, Bus } from "lucide-react";

export const LocationSection = () => {
  const { t } = useLanguage();

  return (
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
  );
};