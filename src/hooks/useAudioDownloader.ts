'use client'

import { useState, useCallback, useRef } from 'react'
import { api, apiRaw } from '@/lib/api'

// ─── Types ──────────────────────────────────────────────────────────────────

export type DownloaderState =
  | 'idle'
  | 'fetching_info'
  | 'ready'
  | 'downloading'
  | 'success'
  | 'error'

export interface PlaylistEntry {
  title: string
  duration: number | null
  url: string
  uploader: string
}

export interface MediaInfo {
  title: string
  duration: number | null
  uploader: string
  thumbnail: string
  isPlaylist: boolean
  entryCount?: number
  entries?: PlaylistEntry[]
}

export interface DownloadOptions {
  url: string
  isPlaylist: boolean
  audioQuality?: string
  embedThumbnail?: boolean
  embedMetadata?: boolean
}

interface UseAudioDownloaderReturn {
  /** Estado actual de la máquina de estados */
  state: DownloaderState
  /** Metadatos del video/playlist obtenidos del servidor */
  mediaInfo: MediaInfo | null
  /** Mensaje de error legible por el usuario */
  error: string | null
  /** URL actual cargada en el input */
  currentUrl: string
  /** Nombre del archivo descargado (para mostrar en éxito) */
  downloadedFileName: string | null
  /** Obtiene info del video/playlist antes de descargar */
  fetchInfo: (url: string) => Promise<void>
  /** Inicia la descarga del audio como blob */
  downloadAudio: (options: DownloadOptions) => Promise<void>
  /** Resetea la máquina de estados a idle */
  reset: () => void
  /** Actualiza la URL sin disparar fetch */
  setCurrentUrl: (url: string) => void
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAudioDownloader(): UseAudioDownloaderReturn {
  const [state, setState] = useState<DownloaderState>('idle')
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState('')
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null)

  // Ref para evitar memory leaks al revocar Object URLs
  const objectUrlRef = useRef<string | null>(null)

  // ── fetchInfo ────────────────────────────────────────────────────────────
  const fetchInfo = useCallback(async (url: string) => {
    if (!url.trim()) return

    setState('fetching_info')
    setError(null)
    setMediaInfo(null)

    try {
      const response = await api.post<MediaInfo>('/v1/download/info', { url })
      setMediaInfo(response.data)
      setState('ready')
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo obtener la información del video. Verifica la URL.'
      setError(message)
      setState('error')
    }
  }, [])

  // ── downloadAudio ────────────────────────────────────────────────────────
  const downloadAudio = useCallback(async (options: DownloadOptions) => {
    setState('downloading')
    setError(null)

    // Revocar Object URL anterior si existe
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    try {
      const response = await apiRaw.post('/v1/download/audio', {
        url: options.url,
        isPlaylist: options.isPlaylist,
        audioQuality: options.audioQuality ?? '0',
        embedThumbnail: options.embedThumbnail ?? true,
        embedMetadata: options.embedMetadata ?? true,
      }, {
        responseType: 'blob',
      })

      // Extraer nombre del archivo desde headers
      const fileName: string =
        (response.headers['x-download-filename'] as string) ??
        (options.isPlaylist ? 'playlist.zip' : 'audio.mp3')

      setDownloadedFileName(fileName)

      // Crear Object URL y forzar descarga en el navegador
      const blob = response.data as Blob
      const downloadUrl = URL.createObjectURL(blob)
      objectUrlRef.current = downloadUrl

      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = fileName
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()

      // Revocar URL después de un breve delay para asegurar que la descarga inició
      setTimeout(() => {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current)
          objectUrlRef.current = null
        }
      }, 2000)

      setState('success')
    } catch (err: unknown) {
      // Los errores de la API retornan JSON incluso cuando el endpoint es blob
      let message = 'Error al descargar el audio. Intenta de nuevo.'

      if (err instanceof Error) {
        message = err.message
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err
      ) {
        // Si el blob es en realidad un JSON de error, leerlo
        const axiosErr = err as { response?: { data?: Blob | { message?: string } } }
        const data = axiosErr.response?.data
        if (data instanceof Blob) {
          try {
            const text = await data.text()
            const json = JSON.parse(text)
            message = json.message ?? message
          } catch {
            // No es JSON, mantener mensaje genérico
          }
        } else if (data && typeof data === 'object' && 'message' in data) {
          message = (data as { message: string }).message
        }
      }

      setError(message)
      setState('error')
    }
  }, [])

  // ── reset ────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setState('idle')
    setMediaInfo(null)
    setError(null)
    setCurrentUrl('')
    setDownloadedFileName(null)
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  return {
    state,
    mediaInfo,
    error,
    currentUrl,
    downloadedFileName,
    fetchInfo,
    downloadAudio,
    reset,
    setCurrentUrl,
  }
}
