import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1852D9] rounded-full mix-blend-screen filter blur-[150px] opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-blue-300 font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Distribuidores Oficiales en Bolivia</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Hardware y Equipos <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#1852D9]">
              Para Profesionales.
            </span>
          </h1>
          
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl leading-relaxed">
            Especialistas en impresoras corporativas, Laptops de alto rendimiento y consumibles originales. Asesoramiento técnico real y envíos a los 9 departamentos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/catalogo" 
              className="inline-flex items-center justify-center gap-2 bg-[#1852D9] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#1340B0] transition-colors"
            >
              Ver Catálogo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contacto" 
              className="inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Cotizar para Empresa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
