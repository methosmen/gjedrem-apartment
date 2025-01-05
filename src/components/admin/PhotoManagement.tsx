import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoSection } from "./PhotoSection";
import { supabase } from "@/lib/supabase";
import { uploadPhoto } from "@/lib/photo-operations";

export const PhotoManagement = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    try {
      console.log('Fetching photos...');
      
      // Fetch photos from both apartment and surroundings folders
      const { data: apartmentFiles, error: apartmentError } = await supabase.storage
        .from('photos')
        .list('apartment', {
          sortBy: { column: 'name', order: 'asc' },
        });

      const { data: surroundingFiles, error: surroundingError } = await supabase.storage
        .from('photos')
        .list('surroundings', {
          sortBy: { column: 'name', order: 'asc' },
        });

      if (apartmentError) {
        console.error('Error fetching apartment photos:', apartmentError);
        return;
      }

      if (surroundingError) {
        console.error('Error fetching surrounding photos:', surroundingError);
        return;
      }

      const getPhotoUrl = (folder: string, name: string) => {
        const { data } = supabase.storage
          .from('photos')
          .getPublicUrl(`${folder}/${name}`);
        return data.publicUrl;
      };

      const apartmentUrls = (apartmentFiles || [])
        .filter(file => !file.name.startsWith('.'))
        .map(file => getPhotoUrl('apartment', file.name));

      const surroundingUrls = (surroundingFiles || [])
        .filter(file => !file.name.startsWith('.'))
        .map(file => getPhotoUrl('surroundings', file.name));

      const allPhotos = [...apartmentUrls, ...surroundingUrls];
      console.log('Photos fetched:', allPhotos);
      setPhotos(allPhotos);
    } catch (error) {
      console.error('Unexpected error fetching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadPhoto(file);
      if (publicUrl) {
        await fetchPhotos();
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bildegalleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            disabled={isUploading}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Laster opp..." : "Last opp nytt bilde"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Laster bilder...</div>
        ) : (
          <PhotoSection
            photos={photos}
            onPhotoDeleted={fetchPhotos}
          />
        )}
      </CardContent>
    </Card>
  );
};