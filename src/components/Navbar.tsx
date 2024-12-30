import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session); // Debug log
      setIsAdmin(session?.user?.email === 'admin@gjedrem.net');
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session); // Debug log
      setIsAdmin(session?.user?.email === 'admin@gjedrem.net');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-lg font-semibold">Gjedrem Apartment</div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
            >
              Admin
            </Button>
          )}
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}