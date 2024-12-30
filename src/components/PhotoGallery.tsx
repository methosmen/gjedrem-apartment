import { PhotoCarousel } from "@/components/PhotoCarousel";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PhotoGallery = () => {
  const { t } = useLanguage();

  const fetchPhotos = async () => {
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
      alt: file.name.split('.')[0]
    }));

    const surroundingPhotos = (surroundingFiles || []).map(file => ({
      src: getPhotoUrl(`surroundings/${file.name}`),
      alt: file.name.split('.')[0]
    }));

    return {
      apartmentPhotos: apartmentPhotos.length ? apartmentPhotos : [{ src: "/placeholder.svg", alt: "Living Room" }],
      surroundingPhotos: surroundingPhotos.length ? surroundingPhotos : [{ src: "/placeholder.svg", alt: "Surroundings" }]
    };
  };

  const { data: photos = { apartmentPhotos: [], surroundingPhotos: [] } } = useQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos,
  });

  return (
    <section className="container mx-auto px-4 pt-24 pb-16">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-6">{t("gallery.apartment")}</h2>
          <PhotoCarousel 
            photos={photos.apartmentPhotos} 
            className="max-w-xl mx-auto"
          />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-6">{t("gallery.surroundings")}</h2>
          <PhotoCarousel 
            photos={photos.surroundingPhotos}
            className="max-w-xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};