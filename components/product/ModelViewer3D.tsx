'use client'

import { useEffect } from 'react'

interface Hotspot {
  slot: string
  position: string
  normal: string
  label: string
  description: string
}

interface ModelViewer3DProps {
  src: string
  poster?: string
  alt: string
  hotspots?: Hotspot[]
}


const DEFAULT_HOTSPOTS: Hotspot[] = [
  {
    slot: 'hotspot-panel',
    position: '0 0.12 0.08',
    normal: '0 0 1',
    label: 'Panel de control',
    description: 'Pantalla LCD táctil con acceso rápido a todas las funciones',
  },
  {
    slot: 'hotspot-input',
    position: '-0.08 -0.05 0.08',
    normal: '0 0 1',
    label: 'Bandeja de entrada',
    description: '250 hojas. Compatible con papel A4, carta y sobres',
  },
  {
    slot: 'hotspot-output',
    position: '0.08 0.03 0.08',
    normal: '0 0 1',
    label: 'Salida de papel',
    description: 'Bandeja de salida con capacidad para 100 hojas',
  },
]

export function ModelViewer3D({ src, poster, alt, hotspots = DEFAULT_HOTSPOTS }: ModelViewer3DProps) {
  useEffect(() => {
    import('@google/model-viewer')
  }, [])

  return (
    <div className="relative w-full h-[420px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl overflow-hidden">
      <model-viewer
        src={src}
        poster={poster}
        alt={alt}
        auto-rotate=""
        camera-controls=""
        shadow-intensity="1"
        exposure="0.9"
        ar=""
        ar-modes="webxr scene-viewer quick-look"
        style={{ width: '100%', height: '100%' }}
      >
        {hotspots.map(h => (
          <button
            key={h.slot}
            slot={h.slot}
            data-position={h.position}
            data-normal={h.normal}
            className="group relative w-8 h-8 rounded-full bg-primary text-white text-xs font-bold shadow-lg border-2 border-white hover:scale-110 transition-transform"
          >
            <span className="flex items-center justify-center w-full h-full">i</span>
            {/* Tooltip */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-52 bg-white rounded-xl shadow-2xl p-3 text-left opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-10 border border-gray-100">
              <p className="text-xs font-bold text-gray-900 mb-1">{h.label}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{h.description}</p>
            </div>
          </button>
        ))}

        {/* Fallback when no 3D file provided */}
        {!src && (
          <div slot="poster" className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <p className="text-sm font-medium">Vista 3D no disponible</p>
            <p className="text-xs">Sube un archivo .glb para activar el visor</p>
          </div>
        )}
      </model-viewer>

      <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-white/80 backdrop-blur px-2 py-1 rounded-full">
        Arrastra para rotar · Pellizcá para zoom
      </div>
    </div>
  )
}
