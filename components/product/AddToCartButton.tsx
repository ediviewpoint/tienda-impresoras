"use client";

import * as React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store/useStore";
import type { Product } from "@/lib/types/index";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const add = useStore(s => s.add);
  const [added, setAdded] = React.useState(false);

  function handleAddToCart() {
    if (!product.inStock) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!product.inStock || added}
      className={`w-full h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${
        added
          ? "bg-success text-white"
          : product.inStock
          ? "bg-primary text-white hover:bg-primary-dark"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span
            key="added"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            ¡Agregado!
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? "Agregar al carrito" : "Agotado"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
