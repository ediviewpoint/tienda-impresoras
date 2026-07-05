export function AnnouncementBar() {
  return (
    <div className="bg-primary text-white text-center py-2 px-4 text-[13px] font-medium tracking-wide">
      <strong>🚚 Envío GRATIS</strong> en compras mayores a Bs. 500
      <span className="mx-2 opacity-50">|</span>
      <strong>Garantía oficial</strong> en todos los productos
      <span className="mx-2 opacity-50">|</span>
      ☎️ Soporte: <strong>{process.env.NEXT_PUBLIC_STORE_PHONE ?? '+591 2 000-0000'}</strong>
    </div>
  )
}
