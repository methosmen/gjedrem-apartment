import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import Image from "@/components/Image";

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
      const { error } = await supabase.storage
        .from('photos')
        .remove([path]);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      await queryClient.invalidateQueries({ queryKey: ['photos'] });

      toast({
        title: "Suksess",
        description: "Bilde slettet",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette bilde",
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Leilighetsbilder</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e, 'apartment')}
              className="hidden"
              id="apartment-photo-upload"
            />
            <label htmlFor="apartment-photo-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Last opp leilighetsbilde</span>
              </Button>
            </label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.apartmentPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Slett bilde</AlertDialogTitle>
                      <AlertDialogDescription>
                        Er du sikker på at du vil slette dette bildet? Dette kan ikke angres.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handlePhotoDelete(photo.path)}
                      >
                        Slett
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Omgivelsesbilder</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e, 'surroundings')}
              className="hidden"
              id="surroundings-photo-upload"
            />
            <label htmlFor="surroundings-photo-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Last opp omgivelsesbilde</span>
              </Button>
            </label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.surroundingPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Slett bilde</AlertDialogTitle>
                      <AlertDialogDescription>
                        Er du sikker på at du vil slette dette bildet? Dette kan ikke angres.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handlePhotoDelete(photo.path)}
                      >
                        Slett
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};