import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You must be logged in to access the admin panel",
          variant: "destructive",
        });
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
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

  const handleDateRangeSelect = async (startDate: Date, endDate: Date) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          { start_date: startDate, end_date: endDate, status: 'occupied' }
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
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
              onSelect={(newDate) => setDate(newDate)}
              className="rounded-md border"
            />
            <Button 
              onClick={() => {
                if (date instanceof Date) {
                  const endDate = new Date(date);
                  endDate.setDate(endDate.getDate() + 7); // Default to 7-day range
                  handleDateRangeSelect(date, endDate);
                }
              }}
              className="w-full"
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