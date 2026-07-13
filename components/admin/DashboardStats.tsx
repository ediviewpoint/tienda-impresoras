"use client";

import { DollarSign, ShoppingBag, Users, PackageX } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatters";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1852D9]">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        {trend && (
          <p className={`text-sm mt-1 font-medium ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
            {trendUp ? "↑" : "↓"} {trend} <span className="text-neutral-400 font-normal">vs mes anterior</span>
          </p>
        )}
      </div>
    </div>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Ventas del Mes" 
        value={formatCurrency(45800)} 
        icon={DollarSign} 
        trend="12.5%" 
        trendUp={true} 
      />
      <StatCard 
        title="Órdenes Pendientes" 
        value={14} 
        icon={ShoppingBag} 
      />
      <StatCard 
        title="Nuevos Clientes" 
        value={89} 
        icon={Users} 
        trend="5.2%" 
        trendUp={true} 
      />
      <StatCard 
        title="Stock Crítico (Agotándose)" 
        value={7} 
        icon={PackageX} 
        trend="Requiere atención" 
        trendUp={false} 
      />
    </div>
  );
}
