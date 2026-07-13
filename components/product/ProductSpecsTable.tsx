"use client";

import * as React from "react";
import { Info } from "lucide-react";

interface SpecItem {
  label: string;
  value: string;
}

interface ProductSpecsTableProps {
  title?: string;
  specs: SpecItem[];
}

export function ProductSpecsTable({ title = "Especificaciones Técnicas", specs }: ProductSpecsTableProps) {
  if (!specs || specs.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-200">
        <Info className="w-5 h-5 text-[#1852D9]" />
        <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
      </div>
      
      <div className="overflow-hidden border border-neutral-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <tbody>
            {specs.map((spec, index) => (
              <tr
                key={spec.label}
                className={`border-b border-neutral-100 last:border-0 ${
                  index % 2 === 0 ? "bg-white" : "bg-neutral-50"
                }`}
              >
                <th 
                  scope="row" 
                  className="px-4 py-3 font-medium text-neutral-700 w-1/3 border-r border-neutral-100"
                >
                  {spec.label}
                </th>
                <td className="px-4 py-3 text-neutral-600">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
