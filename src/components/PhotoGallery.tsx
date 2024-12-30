import { PhotoCarousel } from "@/components/PhotoCarousel";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const PhotoGallery = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

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

  const { data: prices } = useQuery({
    queryKey: ['prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prices')
        .select('key, value');
      
      if (error) throw error;
      
      const priceMap: { [key: string]: number } = {};
      data?.forEach(({ key, value }) => {
        priceMap[key] = value;
      });
      return priceMap;
    },
  });

  // Listen for price updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prices'
        },
        () => {
          // Invalidate the prices query to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ['prices'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <section className="container mx-auto px-4 pt-24 pb-16">
      <div className="grid gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{t("prices.title")}</h2>
          <div className="grid gap-4 max-w-md mx-auto">
            {prices && (
              <>
                <div className="flex justify-between items-center">
                  <span>{t("prices.weekly")}</span>
                  <span className="font-bold">{prices.weekly_price} NOK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("prices.daily")}</span>
                  <span className="font-bold">{prices.daily_price} NOK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("prices.cleaning")}</span>
                  <span className="font-bold">{prices.cleaning_price} NOK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("prices.bedding")}</span>
                  <span className="font-bold">{prices.bedding_price} NOK</span>
                </div>
              </>
            )}
          </div>
        </div>

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
      </div>
    </section>
  );
};