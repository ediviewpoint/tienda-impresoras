"use client";

import * as React from "react";
import { Filter, ChevronDown } from "lucide-react";

const CATEGORIAS = [
  { id: "impresoras-laser", label: "Impresoras Láser", count: 24 },
  { id: "impresoras-tinta", label: "Tinta Continua", count: 45 },
  { id: "toners", label: "Tóners Originales", count: 89 },
  { id: "papel", label: "Papel y Suministros", count: 12 },
];

const MARCAS = [
  { id: "hp", label: "HP" },
  { id: "epson", label: "Epson" },
  { id: "canon", label: "Canon" },
  { id: "brother", label: "Brother" },
];

export function SidebarFilter() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white border border-neutral-200 rounded-xl p-5 sticky top-24">
        
        {/* Título */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-100">
          <Filter className="w-5 h-5 text-neutral-500" />
          <h2 className="text-lg font-bold text-neutral-900">Filtros</h2>
        </div>

        {/* Categorías */}
        <div className="mb-6">
          <h3 className="font-semibold text-neutral-800 mb-3 text-sm uppercase tracking-wider">Categoría</h3>
          <div className="space-y-2">
            {CATEGORIAS.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-neutral-300 text-[#1852D9] focus:ring-[#1852D9]"
                  />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{cat.label}</span>
                </div>
                <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100 my-6"></div>

        {/* Marcas */}
        <div className="mb-6">
          <h3 className="font-semibold text-neutral-800 mb-3 text-sm uppercase tracking-wider">Marcas</h3>
          <div className="space-y-2">
            {MARCAS.map((marca) => (
              <label key={marca.id} className="flex items-center gap-2 group cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-neutral-300 text-[#1852D9] focus:ring-[#1852D9]"
                />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{marca.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-neutral-100 my-6"></div>

        {/* Rango de Precios */}
        <div>
          <h3 className="font-semibold text-neutral-800 mb-3 text-sm uppercase tracking-wider">Precio (Bs.)</h3>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">Bs.</span>
              <input 
                type="number" 
                placeholder="Min" 
                className="w-full pl-7 pr-2 py-2 text-sm border border-neutral-200 rounded-md focus:border-[#1852D9] focus:ring-1 focus:ring-[#1852D9] outline-none"
              />
            </div>
            <span className="text-neutral-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">Bs.</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="w-full pl-7 pr-2 py-2 text-sm border border-neutral-200 rounded-md focus:border-[#1852D9] focus:ring-1 focus:ring-[#1852D9] outline-none"
              />
            </div>
          </div>
          <button className="w-full mt-4 bg-neutral-900 text-white text-sm font-medium py-2 rounded-md hover:bg-neutral-800 transition-colors">
            Aplicar Filtros
          </button>
        </div>

      </div>
    </aside>
  );
}
