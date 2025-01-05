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
      const { data: files, error } = await supabase.storage.from('photos').list();
      
      if (error) {
        console.error('Error fetching photos:', error);
        return;
      }

      const photoUrls = files
        .filter(file => !file.name.startsWith('.'))
        .map(file => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('photos')
            .getPublicUrl(file.name);
          return publicUrl;
        });

      console.log('Photos fetched:', photoUrls);
      setPhotos(photoUrls);
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