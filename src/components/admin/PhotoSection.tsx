import { Button } from "@/components/ui/button";
import Image from "@/components/Image";
import { PhotoDeleteDialog } from "./PhotoDeleteDialog";

interface PhotoSectionProps {
  title: string;
  photos: Array<{ src: string; alt: string; path: string }>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDelete: (path: string) => Promise<void>;
  type: 'apartment' | 'surroundings';
}

export const PhotoSection = ({ title, photos, onUpload, onDelete, type }: PhotoSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
          id={`${type}-photo-upload`}
        />
        <label htmlFor={`${type}-photo-upload`}>
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>Last opp {type === 'apartment' ? 'leilighetsbilde' : 'omgivelsesbilde'}</span>
          </Button>
        </label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <Image
              src={photo.src}
              alt={photo.alt}
              className="w-full h-32 object-cover rounded-lg"
            />
            <PhotoDeleteDialog onConfirmDelete={() => onDelete(photo.path)} />
          </div>
        ))}
      </div>
    </div>
  );
};