import 'react'

type ModelViewerAttributes = React.HTMLAttributes<HTMLElement> & {
  src?: string
  poster?: string
  alt?: string
  'auto-rotate'?: string | boolean
  'camera-controls'?: string | boolean
  'shadow-intensity'?: string
  exposure?: string
  ar?: string | boolean
  'ar-modes'?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes
    }
  }
}
