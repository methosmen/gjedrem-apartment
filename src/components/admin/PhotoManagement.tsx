import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PhotoSection } from "./PhotoSection";
import { deletePhoto, uploadPhoto } from "@/lib/photo-operations";

export const PhotoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = { apartmentPhotos: [], surroundingPhotos: [] }, isLoading, error } = useQuery({
    queryKey: ['admin-photos'],
    queryFn: async () => {
      console.log('Fetching photos...');
      try {
        const { data: apartmentFiles, error: apartmentError } = await supabase.storage
          .from('photos')
          .list('apartment', {
            sortBy: { column: 'name', order: 'asc' },
          });

        if (apartmentError) {
          console.error('Error fetching apartment photos:', apartmentError);
          throw apartmentError;
        }

        const { data: surroundingFiles, error: surroundingError } = await supabase.storage
          .from('photos')
          .list('surroundings', {
            sortBy: { column: 'name', order: 'asc' },
          });

        if (surroundingError) {
          console.error('Error fetching surrounding photos:', surroundingError);
          throw surroundingError;
        }

        const getPhotoUrl = (path: string) => {
          const { data } = supabase.storage
            .from('photos')
            .getPublicUrl(path);
          return data.publicUrl;
        };

        const apartmentPhotos = (apartmentFiles || []).map(file => ({
          src: getPhotoUrl(`apartment/${file.name}`),
          alt: file.name.split('.')[0],
          path: `apartment/${file.name}`
        }));

        const surroundingPhotos = (surroundingFiles || []).map(file => ({
          src: getPhotoUrl(`surroundings/${file.name}`),
          alt: file.name.split('.')[0],
          path: `surroundings/${file.name}`
        }));

        return {
          apartmentPhotos,
          surroundingPhotos
        };
      } catch (error) {
        console.error('Error in photo fetch:', error);
        throw error;
      }
    },
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'apartment' | 'surroundings') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { success } = await uploadPhoto(file, type);
      
      if (success) {
        // Add a small delay before refreshing to ensure Supabase has processed the upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        await queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
        await queryClient.invalidateQueries({ queryKey: ['photos'] });

        toast({
          title: "Suksess",
          description: "Bilde lastet opp",
        });
      }
    } catch (error) {
      console.error('Error in handlePhotoUpload:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke laste opp bilde. Sjekk konsollen for detaljer.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoDelete = async (path: string) => {
    try {
      console.log('Attempting to delete photo:', path);
      
      const { success } = await deletePhoto(path);
      
      if (success) {
        // Add a longer delay before refreshing to ensure Supabase has processed the deletion
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Refresh both queries to ensure UI is updated
        await queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
        await queryClient.invalidateQueries({ queryKey: ['photos'] });

        toast({
          title: "Suksess",
          description: "Bilde slettet",
        });
      }
    } catch (error) {
      console.error('Error in handlePhotoDelete:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette bilde. Sjekk konsollen for detaljer.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="text-red-500">
        Kunne ikke laste bilder. Vennligst oppdater siden eller prøv igjen senere.
      </div>
    );
  }

  if (isLoading) {
    return <div>Laster bilder...</div>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Bildebehandling</h2>
      
      <div className="space-y-8">
        <PhotoSection
          title="Leilighetsbilder"
          photos={photos.apartmentPhotos}
          onUpload={(e) => handlePhotoUpload(e, 'apartment')}
          onDelete={handlePhotoDelete}
          type="apartment"
        />

        <PhotoSection
          title="Omgivelsesbilder"
          photos={photos.surroundingPhotos}
          onUpload={(e) => handlePhotoUpload(e, 'surroundings')}
          onDelete={handlePhotoDelete}
          type="surroundings"
        />
      </div>
    </section>
  );
};