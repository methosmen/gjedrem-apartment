import { useLanguage } from "@/hooks/useLanguage";
import { Fish, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export const FishingSection = () => {
  const { t } = useLanguage();

  const links = [
    {
      key: "report",
      url: "https://bjerkreimelva.no/fangstrapport",
    },
    {
      key: "flow",
      url: "https://www.nve.no/vann-og-vassdrag/vanndata/vannforing-temperatur-og-is/",
    },
    {
      key: "depth",
      url: "https://bjerkreimelva.no/dybdekart",
    },
    {
      key: "rules",
      url: "https://bjerkreimelva.no/fiskeregler",
    },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Fish className="w-6 h-6" />
        <h3 className="text-xl font-semibold">{t("fishing.title")}</h3>
      </div>
      <p className="text-lg leading-relaxed mb-4">{t("fishing.description")}</p>
      <p className="text-lg leading-relaxed mb-8">{t("fishing.zone")}</p>
      
      <div className="space-y-4">
        <h4 className="font-semibold">{t("fishing.links.title")}</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              {t(`fishing.links.${link.key}`)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};