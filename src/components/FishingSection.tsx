import { useLanguage } from "@/hooks/useLanguage";
import { Fish } from "lucide-react";

export const FishingSection = () => {
  const { t } = useLanguage();

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <Fish className="w-6 h-6" />
        <h3 className="text-xl font-semibold">{t("fishing.title")}</h3>
      </div>
      <p className="text-lg leading-relaxed mb-4">{t("fishing.description")}</p>
      <p className="text-lg leading-relaxed mb-8">{t("fishing.zone")}</p>
    </section>
  );
};