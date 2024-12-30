import { Button } from "./ui/button";
import Image from "./Image";
import { useLanguage } from "@/hooks/useLanguage";

const flags = {
  no: "/no-flag.svg",
  gb: "/gb-flag.svg",
  de: "/de-flag.svg",
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      {Object.entries(flags).map(([lang, flag]) => (
        <Button
          key={lang}
          variant={language === lang ? "default" : "ghost"}
          size="icon"
          onClick={() => setLanguage(lang as keyof typeof flags)}
          className="w-8 h-8 p-1"
        >
          <Image src={flag} alt={`${lang} flag`} className="w-full h-full object-cover" />
        </Button>
      ))}
    </div>
  );
}