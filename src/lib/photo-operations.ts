import { supabase } from "./supabase";
import { toast } from "@/hooks/use-toast";

export const deletePhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    console.log('Starting photo deletion for:', photoUrl);
    
    // Extract the file path from the URL
    const path = photoUrl.split('/').pop();
    if (!path) {
      console.error('Invalid photo URL:', photoUrl);
      toast({
        title: "Feil",
        description: "Ugyldig bilde-URL",
        variant: "destructive",
      });
      return false;
    }

    // First, check if the file exists
    const { data: fileExists, error: checkError } = await supabase
      .storage
      .from('photos')
      .list('', {
        search: path
      });

    if (checkError) {
      console.error('Error checking file existence:', checkError);
      toast({
        title: "Feil",
        description: "Kunne ikke verifisere bildefil",
        variant: "destructive",
      });
      return false;
    }

    if (!fileExists.length) {
      console.error('File not found:', path);
      toast({
        title: "Feil",
        description: "Bildefil ikke funnet",
        variant: "destructive",
      });
      return false;
    }

    // Delete the file
    const { error: deleteError } = await supabase
      .storage
      .from('photos')
      .remove([path]);

    if (deleteError) {
      console.error('Error deleting file:', deleteError);
      toast({
        title: "Feil",
        description: "Kunne ikke slette bildefil",
        variant: "destructive",
      });
      return false;
    }

    console.log('Photo deleted successfully:', path);
    toast({
      title: "Suksess",
      description: "Bilde slettet",
    });
    
    // Add a delay to ensure Supabase has processed the deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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

    const { error: uploadError, data } = await supabase
      .storage
      .from('photos')
      .upload(fileName, file);

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