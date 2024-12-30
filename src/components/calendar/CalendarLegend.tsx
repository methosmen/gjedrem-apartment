import { CalendarX, Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const CalendarLegend = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        <CalendarX className="w-4 h-4 text-destructive" />
        <span>{t('booking.legend.occupied')}</span>
      </div>
      <div className="flex items-center gap-1">
        <CheckCircle className="w-4 h-4 text-primary" />
        <span>{t('booking.legend.selected')}</span>
      </div>
      <div className="flex items-center gap-1">
        <CalendarIcon className="w-4 h-4" />
        <span>{t('booking.legend.today')}</span>
      </div>
    </div>
  );
};