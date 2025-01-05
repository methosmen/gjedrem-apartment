import { supabase } from "./supabase";
import { toast } from "@/hooks/use-toast";

export const deletePhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    console.log('Starting photo deletion for:', photoUrl);
    
    // Extract the path from the URL
    const urlPath = new URL(photoUrl).pathname;
    const pathParts = urlPath.split('/');
    // The file path will be after 'photos/' in the URL
    const photosIndex = pathParts.indexOf('photos');
    if (photosIndex === -1) {
      console.error('Invalid photo URL structure:', photoUrl);
      toast({
        title: "Feil",
        description: "Ugyldig bilde-URL struktur",
        variant: "destructive",
      });
      return false;
    }

    // Get the path after 'photos/'
    const filePath = pathParts.slice(photosIndex + 1).join('/');
    console.log('Attempting to delete file:', filePath);

    // Delete the file
    const { error: deleteError } = await supabase
      .storage
      .from('photos')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting file:', deleteError);
      toast({
        title: "Feil",
        description: "Kunne ikke slette bildefil",
        variant: "destructive",
      });
      return false;
    }

    console.log('Photo deleted successfully:', filePath);
    toast({
      title: "Suksess",
      description: "Bilde slettet",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error during photo deletion:', error);
    toast({
      title: "Feil",
      description: "En uventet feil oppstod under sletting av bilde",
      variant: "destructive",
    });
    return false;
  }
};

export const uploadPhoto = async (file: File): Promise<string | null> => {
  try {
    console.log('Starting photo upload for:', file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const folder = 'apartment'; // Default to apartment folder for now

    const filePath = `${folder}/${fileName}`;

    const { error: uploadError, data } = await supabase
      .storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      toast({
        title: "Feil",
        description: "Kunne ikke laste opp bilde",
        variant: "destructive",
      });
      return null;
    }

    if (!data?.path) {
      console.error('No path returned from upload');
      toast({
        title: "Feil",
        description: "Ingen sti returnert fra opplasting",
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('photos')
      .getPublicUrl(data.path);

    console.log('Photo uploaded successfully:', publicUrl);
    toast({
      title: "Suksess",
      description: "Bilde lastet opp",
    });

    return publicUrl;
  } catch (error) {
    console.error('Unexpected error during photo upload:', error);
    toast({
      title: "Feil",
      description: "En uventet feil oppstod under opplasting av bilde",
      variant: "destructive",
    });
    return null;
  }
};
