import { supabase } from "@/lib/supabase";

export async function deletePhoto(path: string) {
  console.log('Starting photo deletion for path:', path);
  
  try {
    const [folder, filename] = path.split('/');
    
    if (!folder || !filename) {
      throw new Error('Invalid file path format');
    }
    
    console.log('Checking if file exists in folder:', folder);
    
    // First verify the file exists
    const { data: files, error: listError } = await supabase.storage
      .from('photos')
      .list(folder);
      
    if (listError) {
      console.error('Error listing files:', listError);
      throw listError;
    }

    const fileExists = files?.some(file => file.name === filename);
    console.log('File exists?', fileExists);
    
    if (!fileExists) {
      throw new Error('File not found in storage');
    }

    // Attempt to delete the file
    const { error: deleteError } = await supabase.storage
      .from('photos')
      .remove([path]);

    if (deleteError) {
      console.error('Error deleting file:', deleteError);
      throw deleteError;
    }

    console.log('File successfully deleted');
    return { success: true };
  } catch (error) {
    console.error('Error in deletePhoto:', error);
    throw error;
  }
}

export async function uploadPhoto(file: File, type: 'apartment' | 'surroundings') {
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
    return { success: true, path: fileName };
  } catch (error) {
    console.error('Error in uploadPhoto:', error);
    throw error;
  }
}