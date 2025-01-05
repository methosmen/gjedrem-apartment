import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PhotoSection } from "./PhotoSection";

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

        console.log('Apartment files:', apartmentFiles);
        console.log('Surrounding files:', surroundingFiles);

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
      console.log('Starting upload for file:', file.name, 'to folder:', type);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}/${Math.random()}.${fileExt}`;

      console.log('Generated filename:', fileName);

      const { error: uploadError, data } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      await queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      await queryClient.invalidateQueries({ queryKey: ['photos'] });

      toast({
        title: "Suksess",
        description: "Bilde lastet opp",
      });
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
      console.log('Attempting to delete:', path);
      
      const [folder, filename] = path.split('/');
      console.log('Folder:', folder, 'Filename:', filename);

      const { data: files, error: listError } = await supabase.storage
        .from('photos')
        .list(folder);
        
      if (listError) {
        console.error('Error listing files:', listError);
        throw listError;
      }

      console.log('Files in folder:', files);
      const fileExists = files?.some(file => file.name === filename);
      
      if (!fileExists) {
        console.error('File not found:', path);
        throw new Error('File not found');
      }

      const { error: deleteError } = await supabase.storage
        .from('photos')
        .remove([path]);

      if (deleteError) {
        console.error('Error deleting file:', deleteError);
        throw deleteError;
      }

      console.log('Delete successful');

      // Refresh the data immediately
      await queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      await queryClient.invalidateQueries({ queryKey: ['photos'] });

      toast({
        title: "Suksess",
        description: "Bilde slettet",
      });
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
    console.error('Error loading photos:', error);
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