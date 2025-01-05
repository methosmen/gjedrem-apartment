import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deletePhoto } from "@/lib/photo-operations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PhotoSectionProps {
  photos: string[];
  onPhotoDeleted: () => void;
}

export const PhotoSection = ({ photos, onPhotoDeleted }: PhotoSectionProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedPhoto) return;
    
    setIsDeleting(true);
    try {
      const success = await deletePhoto(selectedPhoto);
      if (success) {
        onPhotoDeleted();
      }
    } finally {
      setIsDeleting(false);
      setSelectedPhoto(null);
    }
  };

  // Group photos by their folder
  const apartmentPhotos = photos.filter(photo => photo.includes('/apartment/'));
  const surroundingPhotos = photos.filter(photo => photo.includes('/surroundings/'));

  const PhotoGrid = ({ photos, title }: { photos: string[], title: string }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo} className="relative group">
            <img
              src={photo}
              alt="Uploaded content"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => setSelectedPhoto(photo)}
              >
                Slett
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {apartmentPhotos.length > 0 && (
        <PhotoGrid photos={apartmentPhotos} title="Bilder av leiligheten" />
      )}
      
      {surroundingPhotos.length > 0 && (
        <PhotoGrid photos={surroundingPhotos} title="Bilder av omgivelsene" />
      )}

      <AlertDialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil permanent slette bildet fra galleriet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Sletter..." : "Slett"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};