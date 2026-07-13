"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

export function HeaderSearch() {
  const [query, setQuery] = React.useState("");

  return (
    <div className="relative w-full max-w-lg hidden md:block">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por modelo (ej. L3250, LaserJet, Tóner 105A)..."
          className="w-full bg-neutral-100 border-transparent focus:bg-white focus:border-[#1852D9] focus:ring-1 focus:ring-[#1852D9] rounded-full pl-10 pr-10 py-2.5 text-sm transition-all outline-none"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-3 text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Resultados de búsqueda rápidos (Dropdown simulado) */}
      {query.length > 2 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-50">
          <div className="p-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2 mb-2 mt-1">Sugerencias</h4>
            <button className="w-full text-left px-2 py-2 text-sm text-neutral-700 hover:bg-blue-50 hover:text-[#1852D9] rounded-md transition-colors">
              Epson EcoTank <strong>{query}</strong>
            </button>
            <button className="w-full text-left px-2 py-2 text-sm text-neutral-700 hover:bg-blue-50 hover:text-[#1852D9] rounded-md transition-colors">
              Tóner Original para <strong>{query}</strong>
            </button>
          </div>
          <div className="bg-neutral-50 p-3 border-t border-neutral-100 text-center">
            <button className="text-sm font-semibold text-[#1852D9] hover:underline">
              Ver todos los resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
