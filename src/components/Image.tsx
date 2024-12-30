import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function Image({ className, src, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <img
      className={cn(
        "duration-700 ease-in-out",
        isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
        className
      )}
      src={src}
      alt={alt}
      onLoad={() => setIsLoading(false)}
      {...props}
    />
  );
}