import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "@/components/Image";

interface PhotoCarouselProps {
  photos: { src: string; alt: string }[];
  className?: string;
}

export function PhotoCarousel({ photos, className }: PhotoCarouselProps) {
  return (
    <Carousel className={className}>
      <CarouselContent>
        {photos.map((photo, index) => (
          <CarouselItem key={index}>
            <div className="aspect-video w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}