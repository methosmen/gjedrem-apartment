import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      setIsAuthenticated(!!session);
      setIsAdmin(session?.user?.email === 'admin@gjedrem.net');
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setIsAuthenticated(!!session);
      setIsAdmin(session?.user?.email === 'admin@gjedrem.net');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold hover:text-primary transition-colors">
          Gjedrem Apartment
        </Link>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
            >
              Admin
            </Button>
          )}
          {isAuthenticated ? (
            <Button 
              variant="ghost"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="ghost"
              onClick={() => setShowLoginDialog(true)}
            >
              Sign In
            </Button>
          )}
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </DialogContent>
      </Dialog>
    </nav>
  );
}