import { supabase } from "./supabase";
import { toast } from "@/hooks/use-toast";

export const deletePhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    console.log('Starting photo deletion process...');
    console.log('Photo URL to delete:', photoUrl);
    
    // Extract the path from the URL
    // Example URL: https://fpriqrupzrfewpjkxyjp.supabase.co/storage/v1/object/public/photos/apartment/file.jpg
    const urlParts = photoUrl.split('/photos/');
    if (urlParts.length !== 2) {
      console.error('Invalid photo URL structure:', photoUrl);
      toast({
        title: "Feil",
        description: "Ugyldig bilde-URL struktur",
        variant: "destructive",
      });
      return false;
    }

    // Get everything after 'photos/'
    const filePath = urlParts[1];
    console.log('Extracted file path:', filePath);

    console.log('Initiating Supabase storage remove operation...');
    const removeResult = await supabase
      .storage
      .from('photos')
      .remove([filePath]);

    console.log('Supabase remove operation result:', removeResult);

    if (removeResult.error) {
      console.error('Supabase delete error:', removeResult.error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette bildefil",
        variant: "destructive",
      });
      return false;
    }

    console.log('Photo deletion completed successfully');
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