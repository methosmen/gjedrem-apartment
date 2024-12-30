import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@/components/ui/button";
import { PhotoManagement } from "@/components/admin/PhotoManagement";
import { CalendarManagement } from "@/components/admin/CalendarManagement";
import { PriceManagement } from "@/components/admin/PriceManagement";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/');
          toast({
            title: "Ingen tilgang",
            description: "Du må være logget inn for å få tilgang til dette panelet",
            variant: "destructive",
          });
          return;
        }

        // Check if user has admin privileges in profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile?.is_admin) {
          navigate('/');
          toast({
            title: "Ingen tilgang",
            description: "Du må ha administratorrettigheter for å få tilgang til dette panelet",
            variant: "destructive",
          });
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        navigate('/');
        setIsAuthenticated(false);
        return;
      }

      // Check admin status when auth state changes
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (!profile?.is_admin) {
        navigate('/');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Laster...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 max-w-md">
          <Auth 
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
            view="sign_in"
            showLinks={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administrasjonspanel</h1>
          <Button 
            variant="outline" 
            onClick={() => supabase.auth.signOut()}
          >
            Logg ut
          </Button>
        </div>
        
        <div className="grid gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            <PhotoManagement />
            <CalendarManagement />
          </div>
          <PriceManagement />
        </div>
      </main>
    </div>
  );
};

export default Admin;