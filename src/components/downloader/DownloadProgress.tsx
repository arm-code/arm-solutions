'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Download, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { DownloaderState } from '@/hooks/useAudioDownloader'

// ─── Status messages ─────────────────────────────────────────────────────────

const DOWNLOADING_MESSAGES = [
  'Enviando solicitud al servidor...',
  'Procesando audio con yt-dlp...',
  'Extrayendo pista de audio...',
  'Convirtiendo a MP3...',
  'Incrustando metadatos y portada...',
  'Preparando descarga en tu dispositivo...',
]

// Cycle through messages every N ms to simulate progress feedback
const MESSAGE_INTERVAL_MS = 4500

// ─── Props ───────────────────────────────────────────────────────────────────

interface DownloadProgressProps {
  state: DownloaderState
  fileName: string | null
  onReset: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DownloadProgress({ state, fileName, onReset }: DownloadProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const isDownloading = state === 'downloading'
  const isSuccess = state === 'success'

  // Rotar mensajes durante la descarga con fade entre ellos
  useEffect(() => {
    if (!isDownloading) {
      setMessageIndex(0)
      return
    }

    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMessageIndex((i) => Math.min(i + 1, DOWNLOADING_MESSAGES.length - 1))
        setVisible(true)
      }, 300)
    }, MESSAGE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isDownloading])

  // Reset message index when download starts
  useEffect(() => {
    if (isDownloading) {
      setMessageIndex(0)
      setVisible(true)
    }
  }, [isDownloading])

  if (!isDownloading && !isSuccess) return null

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-5 py-4',
        'transition-all duration-300',
      )}
      role="status"
      aria-live="polite"
      aria-label={isSuccess ? 'Descarga completada' : 'Descarga en progreso'}
    >
      {isDownloading && (
        <>
          {/* Spinner + icono */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            <Download className="h-6 w-6 text-primary" />
          </div>

          {/* Barra de progreso indeterminada */}
          <div className="w-full space-y-2.5">
            <Progress
              value={undefined}
              className="h-2 w-full rounded-full [&>*]:animate-[indeterminate_1.5s_ease-in-out_infinite]"
              aria-label="Progreso de descarga"
            />

            {/* Mensaje dinámico con fade */}
            <div className="flex h-5 items-center justify-center overflow-hidden">
              <p
                className={cn(
                  'text-xs text-muted-foreground text-center transition-opacity duration-300',
                  visible ? 'opacity-100' : 'opacity-0',
                )}
              >
                {DOWNLOADING_MESSAGES[messageIndex]}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/70 text-center px-4 leading-relaxed">
            Las descargas pueden tardar hasta <strong>varios minutos</strong>.
            No cierres esta ventana.
          </p>
        </>
      )}

      {isSuccess && (
        <>
          {/* Ícono de éxito */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-9 w-9 text-green-500" strokeWidth={1.5} />
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-foreground">¡Descarga completada!</p>
            {fileName && (
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[240px]">
                {fileName}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              El archivo se guardó en tu carpeta de descargas.
            </p>
          </div>

          {/* Loader que muestra spinner si la descarga no inició automáticamente */}
          <div className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin opacity-60" />
            Si la descarga no inició, revisa los permisos del navegador.
          </div>

          {/* Botón para nueva descarga */}
          <Button
            id="reset-downloader-btn"
            variant="outline"
            className="h-11 gap-2 rounded-xl touch-manipulation active:scale-95 transition-transform"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
            Descargar otra canción
          </Button>
        </>
      )}
    </div>
  )
}
