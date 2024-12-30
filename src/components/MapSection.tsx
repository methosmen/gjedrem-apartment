import { useLanguage } from "@/hooks/useLanguage";

export const MapSection = () => {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">{t("nav.location")}</h2>
      <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2070.011433033335!2d5.996502776961437!3d58.62876097406878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x463a0b89a8b8b8b7%3A0x8b8b8b8b8b8b8b8b!2sGjedrem%205%2C%204387%20Bjerkreim!5e0!3m2!1sen!2sno!4v1620000000000!5m2!1sen!2sno"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};