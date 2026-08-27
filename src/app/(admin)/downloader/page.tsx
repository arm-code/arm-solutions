'use client'

import { useAudioDownloader } from '@/hooks/useAudioDownloader'
import { UrlInputCard } from '@/components/downloader/UrlInputCard'
import { MediaPreviewCard } from '@/components/downloader/MediaPreviewCard'
import { DownloadProgress } from '@/components/downloader/DownloadProgress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function DownloaderPage() {
  const {
    state,
    mediaInfo,
    error,
    currentUrl,
    downloadedFileName,
    fetchInfo,
    downloadAudio,
    reset,
    setCurrentUrl,
  } = useAudioDownloader()

  const showUrlInput = ['idle', 'fetching_info', 'ready', 'error'].includes(state)
  const showPreview = state === 'ready' || state === 'downloading'
  const showProgress = state === 'downloading' || state === 'success'

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Audio Downloader</h1>
        <p className="text-sm text-muted-foreground">
          Descarga canciones y playlists de YouTube en formato MP3.
        </p>
      </div>

      {/* ── Main card ── */}
      <div
        className={cn(
          'w-full max-w-lg mx-auto',
          'rounded-2xl border bg-card text-card-foreground shadow-sm',
          'p-5 sm:p-6',
          'flex flex-col gap-5',
          'transition-all duration-300',
        )}
      >
        {/* URL Input */}
        {showUrlInput && (
          <UrlInputCard
            value={currentUrl}
            onChange={setCurrentUrl}
            onFetchInfo={fetchInfo}
            state={state}
            error={error}
          />
        )}

        {/* Separador entre input y preview */}
        {showUrlInput && showPreview && (
          <Separator />
        )}

        {/* Media Preview */}
        {showPreview && mediaInfo && (
          <MediaPreviewCard
            mediaInfo={mediaInfo}
            url={currentUrl}
            isDownloading={state === 'downloading'}
            onDownload={downloadAudio}
          />
        )}

        {/* Separador entre preview y progreso */}
        {showPreview && showProgress && (
          <Separator />
        )}

        {/* Download Progress / Success */}
        {showProgress && (
          <DownloadProgress
            state={state}
            fileName={downloadedFileName}
            onReset={reset}
          />
        )}
      </div>

      {/* ── Info footer ── */}
      <p className="text-center text-xs text-muted-foreground max-w-sm mx-auto">
        Solo se admiten URLs de YouTube. Asegúrate de tener los derechos necesarios
        sobre el contenido que descargues.
      </p>
    </div>
  )
}
