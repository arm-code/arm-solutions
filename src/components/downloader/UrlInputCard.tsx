'use client'

import { useRef } from 'react'
import { Clipboard, Link2, Loader2, Music2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { DownloaderState } from '@/hooks/useAudioDownloader'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|playlist\?list=|shorts\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=).+/i

function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url.trim())
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface UrlInputCardProps {
  value: string
  onChange: (url: string) => void
  onFetchInfo: (url: string) => void
  state: DownloaderState
  error: string | null
}

// ─── Component ───────────────────────────────────────────────────────────────

export function UrlInputCard({
  value,
  onChange,
  onFetchInfo,
  state,
  error,
}: UrlInputCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const isFetching = state === 'fetching_info'
  const isDisabled = isFetching || state === 'downloading'

  // Pegar desde portapapeles
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        onChange(text.trim())
        // Auto-submit si la URL pegada es válida
        if (isValidYouTubeUrl(text.trim())) {
          onFetchInfo(text.trim())
        }
        toast.success('URL pegada desde el portapapeles')
      }
    } catch {
      toast.error('No se pudo acceder al portapapeles', {
        description: 'Pega la URL manualmente en el campo.',
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) {
      toast.error('Ingresa una URL de YouTube')
      return
    }
    if (!isValidYouTubeUrl(value)) {
      toast.error('URL no válida', {
        description: 'Solo se aceptan URLs de YouTube (youtube.com, youtu.be, music.youtube.com).',
      })
      return
    }
    onFetchInfo(value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isDisabled) {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <Music2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold leading-tight">Pegar enlace de YouTube</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Videos individuales, playlists o YouTube Music
          </p>
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              id="youtube-url-input"
              type="url"
              inputMode="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              className={cn(
                'pl-9 h-11 text-sm rounded-xl border-input transition-colors',
                'focus-visible:ring-2 focus-visible:ring-primary/40',
                error && state === 'error' && 'border-destructive focus-visible:ring-destructive/40',
              )}
              aria-label="URL de YouTube"
              aria-describedby={error ? 'url-error' : undefined}
            />
          </div>

          {/* Botón pegar portapapeles */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl touch-manipulation active:scale-95 transition-transform"
            onClick={handlePaste}
            disabled={isDisabled}
            title="Pegar desde portapapeles"
            aria-label="Pegar URL desde portapapeles"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </div>

        {/* Botón principal */}
        <Button
          type="submit"
          className={cn(
            'h-12 w-full rounded-xl font-semibold text-sm gap-2 touch-manipulation',
            'active:scale-[0.98] transition-all duration-150',
          )}
          disabled={isDisabled || !value.trim()}
        >
          {isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Obteniendo información...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Obtener información
            </>
          )}
        </Button>
      </form>

      {/* Error message */}
      {error && state === 'error' && (
        <div
          id="url-error"
          role="alert"
          className={cn(
            'flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5',
            'px-4 py-3 text-sm text-destructive',
          )}
        >
          <span className="mt-0.5 shrink-0 text-base leading-none">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* URL examples hint */}
      {state === 'idle' && !value && (
        <div className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-1.5">
          <p className="font-medium text-foreground/70">URLs soportadas:</p>
          <ul className="space-y-1 list-none">
            <li>▸ <span className="font-mono">youtube.com/watch?v=...</span> — Video individual</li>
            <li>▸ <span className="font-mono">youtube.com/playlist?list=...</span> — Playlist completa</li>
            <li>▸ <span className="font-mono">youtu.be/...</span> — Enlace corto</li>
            <li>▸ <span className="font-mono">music.youtube.com/...</span> — YouTube Music</li>
          </ul>
        </div>
      )}
    </div>
  )
}
