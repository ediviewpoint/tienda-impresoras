"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/formatters";

// Simulación rápida de tipo. En producción vendría de Prisma.
interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: string;
  slug: string;
}

interface RelatedProductsProps {
  title?: string;
  products: RelatedProduct[];
}

export function RelatedProducts({ title = "Accesorios y Consumibles Compatibles", products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mt-16 pt-10 border-t border-neutral-200">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">{title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/producto/${product.slug}`}
            className="group flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Imagen */}
            <div className="relative aspect-square bg-neutral-50 p-4">
              {product.badge && (
                <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded">
                  {product.badge}
                </span>
              )}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            
            {/* Info */}
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-sm font-medium text-neutral-800 line-clamp-2 mb-2 group-hover:text-[#1852D9] transition-colors">
                {product.name}
              </h4>
              <div className="mt-auto">
                <span className="text-lg font-bold text-neutral-900">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
