"use client";

import * as React from "react";
import { Flame, AlertCircle } from "lucide-react";

interface StockAlertProps {
  stockCount: number;
  threshold?: number; // Cuándo empezar a mostrar la alerta (ej. si quedan menos de 5)
}

export function StockAlert({ stockCount, threshold = 5 }: StockAlertProps) {
  if (stockCount > threshold) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium py-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        Stock disponible
      </div>
    );
  }

  if (stockCount === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium py-3 px-4 bg-red-50 rounded-lg border border-red-100">
        <AlertCircle className="w-4 h-4" />
        Producto agotado por el momento.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-orange-600 text-sm font-bold py-3 px-4 bg-orange-50 rounded-lg border border-orange-100 animate-pulse">
      <Flame className="w-4 h-4" />
      ¡Date prisa! Solo quedan {stockCount} unidades disponibles.
    </div>
  );
}
