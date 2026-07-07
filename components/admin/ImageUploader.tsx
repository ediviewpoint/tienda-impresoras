'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

export interface ImageEntry {
  url: string
  order: number
  uploading?: boolean
  error?: string
}

interface Props {
  images: ImageEntry[]
  onChange: (images: ImageEntry[]) => void
  maxImages?: number
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
const MAX_BYTES = 4 * 1024 * 1024
const MAX_PX = 1920

async function resizeFile(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  let tw = width
  let th = height
  if (width > MAX_PX || height > MAX_PX) {
    if (width >= height) {
      tw = MAX_PX
      th = Math.round((height / width) * MAX_PX)
    } else {
      th = MAX_PX
      tw = Math.round((width / height) * MAX_PX)
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, tw, th)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob falló'))),
      file.type,
      0.88,
    )
  })
}

export default function ImageUploader({ images, onChange, maxImages = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  // Ref so async upload callbacks always see the latest images array
  const imagesRef = useRef<ImageEntry[]>(images)
  imagesRef.current = images

  async function handleFiles(files: FileList | null) {
    if (!files) return
    const slots = maxImages - imagesRef.current.filter(i => !i.uploading).length
    const accepted = Array.from(files).slice(0, slots)

    for (const file of accepted) {
      if (!ALLOWED.includes(file.type)) {
        const cur = imagesRef.current
        const next: ImageEntry[] = [...cur, { url: '', order: cur.length, uploading: false, error: `${file.name}: tipo no permitido` }]
        imagesRef.current = next
        onChange(next)
        continue
      }
      if (file.size > MAX_BYTES) {
        const cur = imagesRef.current
        const next: ImageEntry[] = [...cur, { url: '', order: cur.length, uploading: false, error: `${file.name}: supera 4 MB` }]
        imagesRef.current = next
        onChange(next)
        continue
      }

      const placeholder: ImageEntry = { url: '', order: imagesRef.current.length, uploading: true }
      const withPlaceholder: ImageEntry[] = [...imagesRef.current, placeholder]
      imagesRef.current = withPlaceholder
      onChange(withPlaceholder)

      try {
        // SVG is vector — skip canvas resize to preserve the format
        const blob = file.type === 'image/svg+xml' ? file : await resizeFile(file)
        const form = new FormData()
        form.append('file', blob, file.name)

        const res = await fetch('/api/upload', { method: 'POST', body: form })
        const data = await res.json() as { url?: string; error?: string }

        if (!res.ok) throw new Error(data.error ?? 'Error al subir')

        const resolved: ImageEntry[] = imagesRef.current.map((img, idx) =>
          img === placeholder ? { url: data.url!, order: idx, uploading: false } : img,
        )
        imagesRef.current = resolved
        onChange(resolved)
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Error'
        const failed: ImageEntry[] = imagesRef.current.map((img, idx) =>
          img === placeholder ? { url: '', order: idx, uploading: false, error: errMsg } : img,
        )
        imagesRef.current = failed
        onChange(failed)
      }
    }
  }

  function remove(index: number) {
    const next = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, order: i }))
    onChange(next)
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...images]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next.map((img, i) => ({ ...img, order: i })))
  }

  const canAdd = images.filter(i => !i.uploading).length < maxImages

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {img.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#1852D9] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : img.error ? (
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <p className="text-[10px] text-red-500 text-center leading-tight">{img.error}</p>
                </div>
              ) : img.url ? (
                <Image src={img.url} alt={`Imagen ${i + 1}`} fill className="object-cover" unoptimized />
              ) : null}

              {!img.uploading && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="w-6 h-6 rounded bg-white/90 text-gray-700 text-xs font-bold disabled:opacity-30 hover:bg-white"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="w-6 h-6 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    className="w-6 h-6 rounded bg-white/90 text-gray-700 text-xs font-bold disabled:opacity-30 hover:bg-white"
                  >
                    →
                  </button>
                </div>
              )}

              {i === 0 && !img.uploading && img.url && (
                <span className="absolute top-1 left-1 text-[9px] font-bold bg-[#1852D9] text-white px-1 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {canAdd && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragging ? 'border-[#1852D9] bg-blue-50' : 'border-gray-200 hover:border-[#1852D9] hover:bg-gray-50'
          }`}
        >
          <p className="text-sm text-gray-500">
            Arrastra imágenes aquí o <span className="text-[#1852D9] font-semibold">selecciona archivos</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPEG, PNG, WebP, SVG · máx. 4 MB · hasta {maxImages} imágenes
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>
      )}

      {!canAdd && (
        <p className="text-xs text-gray-400 text-center">Máximo {maxImages} imágenes alcanzado.</p>
      )}
    </div>
  )
}
