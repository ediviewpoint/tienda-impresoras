'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import { useTieneFactura } from '@/lib/store/useStore'

export function FacturaToggle() {
  const { tieneFactura, setTieneFactura } = useTieneFactura()

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
      <span className={`text-sm font-semibold transition-colors ${!tieneFactura ? 'text-white' : 'text-white/50'}`}>
        S/F
      </span>

      <Switch
        checked={tieneFactura}
        onCheckedChange={setTieneFactura}
        className="data-[state=checked]:bg-emerald-400 data-[state=unchecked]:bg-white/30"
      />

      <span className={`text-sm font-semibold transition-colors ${tieneFactura ? 'text-white' : 'text-white/50'}`}>
        C/F
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={tieneFactura ? 'factura' : 'sin-factura'}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          className="text-xs font-bold text-white/70 ml-1"
        >
          {tieneFactura ? '(+IVA incluido)' : '(-16% IVA)'}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
