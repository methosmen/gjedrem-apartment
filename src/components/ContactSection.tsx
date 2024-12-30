import { Mail, Phone, User } from "lucide-react";

export const ContactSection = () => {
  // Obfuscate email to prevent bots from scraping it
  const emailParts = ['kgjedrem5', 'gmail.com'];
  
  return (
    <section className="container mx-auto px-4 py-8 mt-8">
      <div className="bg-accent/50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>Karl Gjedrem</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <a 
              href={`mailto:${emailParts[0]}@${emailParts[1]}`}
              className="hover:underline text-primary"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `mailto:${emailParts[0]}@${emailParts[1]}`;
              }}
            >
              Send e-post
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <a 
              href="tel:+4794831043"
              className="hover:underline text-primary"
            >
              +47 948 31 043
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};