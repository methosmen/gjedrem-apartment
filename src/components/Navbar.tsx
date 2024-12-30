import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-lg font-semibold">Gjedrem Apartment</div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden md:inline-flex"
            onClick={() => navigate("/admin")}
          >
            Admin
          </Button>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}