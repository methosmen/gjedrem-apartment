import { supabase } from "./supabase";
import { toast } from "sonner";

export const uploadPhoto = async (file: File) => {
  const { data, error } = await supabase.storage
    .from("photos")
    .upload(`${Date.now()}-${file.name}`, file);

  if (error) {
    console.error("Error uploading photo:", error);
    toast.error("Failed to upload photo");
    return null;
  }

  return data.path;
};

export const deletePhoto = async (photoUrl: string) => {
  console.log('Starting photo deletion process for URL:', photoUrl);

  // Extract the file name from the URL using a more precise regex
  const pathMatch = photoUrl.match(/[^/]+$/);
  
  if (!pathMatch) {
    console.error('Could not extract file path from URL:', photoUrl);
    toast.error("Invalid photo URL format");
    return false;
  }

  // Use just the filename without any prefix
  const fileName = pathMatch[0];
  console.log('Extracted file name:', fileName);

  console.log('Initiating Supabase storage remove operation...');
  const { data, error } = await supabase.storage
    .from("photos")
    .remove([fileName]);

  if (error) {
    console.error('Supabase deletion error:', error);
    toast.error("Failed to delete photo");
    return false;
  }

  if (!data || data.length === 0) {
    console.error('No files were deleted');
    toast.error("No files were deleted");
    return false;
  }

  console.log('Photo deletion successful:', data);
  toast.success("Photo deleted successfully");
  return true;
};

export const getPhotoUrl = (path: string) => {
  if (!path) return null;
  
  const { data } = supabase.storage
    .from("photos")
    .getPublicUrl(path);

  return data.publicUrl;
};