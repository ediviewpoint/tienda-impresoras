"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductGalleryProps {
  images: string[];
  alt?: string;
}

export function ProductGallery({ images, alt = "Producto" }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Imagen Principal */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
        <Image
          src={selectedImage}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Miniaturas en Carrusel */}
      {images.length > 1 && (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem key={image} className="pl-2 basis-1/4 lg:basis-1/5">
                <button
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 bg-neutral-50 transition-all ${
                    selectedImage === image ? "border-primary" : "border-transparent hover:border-neutral-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${alt} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-2" />
          <CarouselNext className="hidden md:flex right-2" />
        </Carousel>
      )}
    </div>
  );
}
