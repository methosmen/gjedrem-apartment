import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Admin = () => {
  const { t } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== 'admin@gjedrem.net') {
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You must be logged in as admin to access this panel",
            variant: "destructive",
          });
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session || session.user.email !== 'admin@gjedrem.net') {
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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'apartment' | 'surroundings') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    }
  };

  const handleDateRangeSelect = async () => {
    if (!date?.from || !date?.to) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          { 
            start_date: date.from.toISOString().split('T')[0], 
            end_date: date.to.toISOString().split('T')[0], 
            status: 'occupied' 
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Date range updated successfully",
      });
    } catch (error) {
      console.error('Error updating date range:', error);
      toast({
        title: "Error",
        description: "Failed to update date range",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button 
            variant="outline" 
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Photo Management */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Photo Management</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Apartment Photos</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'apartment')}
                  className="hidden"
                  id="apartment-photo-upload"
                />
                <label htmlFor="apartment-photo-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Upload Apartment Photo</span>
                  </Button>
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Surroundings Photos</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'surroundings')}
                  className="hidden"
                  id="surroundings-photo-upload"
                />
                <label htmlFor="surroundings-photo-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Upload Surroundings Photo</span>
                  </Button>
                </label>
              </div>
            </div>
          </section>

          {/* Calendar Management */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Calendar Management</h2>
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <Button 
              onClick={handleDateRangeSelect}
              className="w-full"
              disabled={!date?.from || !date?.to}
            >
              Set as Occupied
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Admin;
