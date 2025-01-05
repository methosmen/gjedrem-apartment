import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PhotoSection } from "./PhotoSection";

export const PhotoManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = { apartmentPhotos: [], surroundingPhotos: [] }, isLoading } = useQuery({
    queryKey: ['admin-photos'],
    queryFn: async () => {
      const { data: apartmentFiles } = await supabase.storage
        .from('photos')
        .list('apartment', {
          sortBy: { column: 'name', order: 'asc' },
        });

      const { data: surroundingFiles } = await supabase.storage
        .from('photos')
        .list('surroundings', {
          sortBy: { column: 'name', order: 'asc' },
        });

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
    },
  });

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

      await queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      await queryClient.invalidateQueries({ queryKey: ['photos'] });

      toast({
        title: "Suksess",
        description: "Bilde lastet opp",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke laste opp bilde",
        variant: "destructive",
      });
    }
  };

  const handlePhotoDelete = async (path: string) => {
    try {
      console.log('Forsøker å slette:', path);
      
      // Først, sjekk om filen eksisterer
      const { data: fileExists, error: checkError } = await supabase.storage
        .from('photos')
        .list(path.split('/')[0], {
          search: path.split('/')[1]
        });

      if (checkError) {
        console.error('Feil ved sjekk av fil:', checkError);
        throw checkError;
      }

      if (!fileExists || fileExists.length === 0) {
        console.error('Filen finnes ikke:', path);
        throw new Error('Filen finnes ikke');
      }

      // Prøv å slette filen
      const { error: deleteError, data } = await supabase.storage
        .from('photos')
        .remove([path]);

      if (deleteError) {
        console.error('Feil fra Supabase ved sletting:', deleteError);
        throw deleteError;
      }

      console.log('Slette-respons:', data);
      
      // Oppdater cache etter vellykket sletting
      await queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      await queryClient.invalidateQueries({ queryKey: ['photos'] });

      toast({
        title: "Suksess",
        description: "Bilde slettet",
      });
    } catch (error) {
      console.error('Feil ved sletting av bilde:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette bilde. Vennligst prøv igjen.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Laster...</div>;
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