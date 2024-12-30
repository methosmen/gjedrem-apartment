import { useLanguage } from "@/hooks/useLanguage";
import {
  Tv,
  Utensils,
  ShowerHead,
  Wifi,
  Bath,
} from "lucide-react";

export const FacilitiesSection = () => {
  const { t } = useLanguage();

  const facilities = [
    { icon: Tv, label: t("facilities.tv") },
    { icon: Utensils, label: t("facilities.kitchen") },
    { icon: ShowerHead, label: t("facilities.shower") },
    { icon: Wifi, label: t("facilities.wifi") },
    { icon: Bath, label: t("facilities.towels") },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
      {facilities.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-accent/50"
        >
          <Icon className="w-6 h-6" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};