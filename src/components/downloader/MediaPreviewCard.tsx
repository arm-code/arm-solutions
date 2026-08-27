'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileArchive,
  ListMusic,
  Mic2,
  Music,
  Settings2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { MediaInfo, DownloadOptions } from '@/hooks/useAudioDownloader'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m >= 60) {
    const h = Math.floor(m / 60)
    const rem = m % 60
    return `${h}:${rem.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

const MAX_VISIBLE_ENTRIES = 5

// ─── Props ───────────────────────────────────────────────────────────────────

interface MediaPreviewCardProps {
  mediaInfo: MediaInfo
  url: string
  isDownloading: boolean
  onDownload: (options: DownloadOptions) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MediaPreviewCard({
  mediaInfo,
  url,
  isDownloading,
  onDownload,
}: MediaPreviewCardProps) {
  const [embedThumbnail, setEmbedThumbnail] = useState(true)
  const [embedMetadata, setEmbedMetadata] = useState(true)
  const [showAllEntries, setShowAllEntries] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)

  const entries = mediaInfo.entries ?? []
  const visibleEntries = showAllEntries ? entries : entries.slice(0, MAX_VISIBLE_ENTRIES)
  const hasMoreEntries = entries.length > MAX_VISIBLE_ENTRIES

  const handleDownload = () => {
    onDownload({
      url,
      isPlaylist: mediaInfo.isPlaylist,
      audioQuality: '0',
      embedThumbnail,
      embedMetadata,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Thumbnail + info principal ── */}
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
          {!thumbnailError && mediaInfo.thumbnail ? (
            <Image
              src={mediaInfo.thumbnail}
              alt={mediaInfo.title}
              fill
              className="object-cover"
              onError={() => setThumbnailError(true)}
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Music className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}

          {/* Overlay badge para playlist */}
          {mediaInfo.isPlaylist && (
            <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              <ListMusic className="h-3 w-3" />
              {mediaInfo.entryCount ?? entries.length}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-1 min-w-0 flex-col justify-between py-0.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {mediaInfo.isPlaylist ? (
                <Badge variant="secondary" className="text-[11px] gap-1 h-5 px-1.5">
                  <ListMusic className="h-3 w-3" />
                  Playlist
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[11px] gap-1 h-5 px-1.5">
                  <Music className="h-3 w-3" />
                  Audio
                </Badge>
              )}
              {mediaInfo.isPlaylist && mediaInfo.entryCount && (
                <Badge variant="outline" className="text-[11px] h-5 px-1.5">
                  {mediaInfo.entryCount} canciones
                </Badge>
              )}
            </div>

            <h3 className="text-sm font-semibold leading-tight line-clamp-2">
              {mediaInfo.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {mediaInfo.uploader && (
              <span className="flex items-center gap-1 truncate">
                <Mic2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{mediaInfo.uploader}</span>
              </span>
            )}
            {!mediaInfo.isPlaylist && mediaInfo.duration && (
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="h-3 w-3" />
                {formatDuration(mediaInfo.duration)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Lista de canciones (playlist) ── */}
      {mediaInfo.isPlaylist && entries.length > 0 && (
        <div className="rounded-xl border bg-muted/30 overflow-hidden">
          <div className="px-3 py-2 border-b bg-muted/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Canciones en la playlist
            </span>
          </div>
          <ul className="divide-y divide-border">
            {visibleEntries.map((entry, i) => (
              <li key={entry.url ?? i} className="flex items-center gap-3 px-3 py-2.5">
                <span className="text-xs text-muted-foreground font-mono w-5 text-right shrink-0">
                  {i + 1}
                </span>
                <div className="flex flex-1 min-w-0 flex-col">
                  <span className="text-xs font-medium truncate">{entry.title}</span>
                  {entry.uploader && (
                    <span className="text-[10px] text-muted-foreground truncate">{entry.uploader}</span>
                  )}
                </div>
                {entry.duration && (
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    {formatDuration(entry.duration)}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {hasMoreEntries && (
            <button
              type="button"
              onClick={() => setShowAllEntries((v) => !v)}
              className={cn(
                'flex w-full items-center justify-center gap-1.5 border-t px-3 py-2.5',
                'text-xs font-medium text-primary hover:bg-muted/60 transition-colors touch-manipulation',
              )}
            >
              {showAllEntries ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  Ver {entries.length - MAX_VISIBLE_ENTRIES} canciones más
                </>
              )}
            </button>
          )}
        </div>
      )}

      <Separator />

      {/* ── Opciones avanzadas ── */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className={cn(
            'flex w-full items-center justify-between text-xs font-medium text-muted-foreground',
            'hover:text-foreground transition-colors touch-manipulation py-1',
          )}
          aria-expanded={showAdvanced}
        >
          <span className="flex items-center gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Opciones avanzadas
          </span>
          {showAdvanced ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 flex flex-col gap-3 rounded-xl border bg-muted/30 px-4 py-3">
            {/* embedThumbnail */}
            <div className="flex items-center justify-between gap-4 min-h-[44px]">
              <div className="flex flex-col">
                <Label htmlFor="embed-thumbnail" className="text-xs font-medium cursor-pointer">
                  Incrustar portada
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Agrega la carátula al archivo MP3
                </span>
              </div>
              <Switch
                id="embed-thumbnail"
                checked={embedThumbnail}
                onCheckedChange={setEmbedThumbnail}
                className="shrink-0"
                aria-label="Incrustar portada en el MP3"
              />
            </div>

            <Separator />

            {/* embedMetadata */}
            <div className="flex items-center justify-between gap-4 min-h-[44px]">
              <div className="flex flex-col">
                <Label htmlFor="embed-metadata" className="text-xs font-medium cursor-pointer">
                  Incrustar metadatos
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Agrega título, artista y álbum al MP3
                </span>
              </div>
              <Switch
                id="embed-metadata"
                checked={embedMetadata}
                onCheckedChange={setEmbedMetadata}
                className="shrink-0"
                aria-label="Incrustar metadatos en el MP3"
              />
            </div>

            <div className="rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
              Calidad de audio: <span className="font-semibold text-foreground">Máxima (~320kbps VBR)</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Botón CTA ── */}
      <Button
        id="download-audio-btn"
        onClick={handleDownload}
        disabled={isDownloading}
        size="lg"
        className={cn(
          'h-12 w-full rounded-xl font-semibold gap-2 touch-manipulation',
          'active:scale-[0.98] transition-all duration-150',
        )}
      >
        {mediaInfo.isPlaylist ? (
          <>
            <FileArchive className="h-4 w-4" />
            Descargar Playlist (.zip)
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Descargar MP3
          </>
        )}
      </Button>

      {mediaInfo.isPlaylist && (
        <p className="text-center text-[11px] text-muted-foreground">
          Las playlists se descargan como un archivo <span className="font-mono">.zip</span> con todos los MP3 dentro.
          La conversión puede tardar varios minutos.
        </p>
      )}
    </div>
  )
}
