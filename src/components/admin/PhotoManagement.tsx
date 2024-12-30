import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const PhotoManagement = () => {
  const { toast } = useToast();

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

  return (
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
  );
};