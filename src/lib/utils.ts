import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { PlayingTrack, Track } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNextIndex<T>(array: T[], currentIndex: number): number {
  if (array.length === 0) return -1

  return (currentIndex + 1) % array.length
}

export function getPrevIndex<T>(array: T[], currentIndex: number): number {
  if (array.length === 0) return -1

  return (currentIndex - 1 + array.length) % array.length
}

export const createPlayingTrack = (track: Track, index: number): PlayingTrack => {
  const { id, artist_name, name, image, audiodownload, duration, isLiked } = track

  return {
    id,
    name,
    artist_name,
    image,
    audiodownload,
    duration,
    isLiked,
    index,
  }
}

export function assertError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw error
  }
}

export function toMinutesAndSeconds(seconds: number): string {
  if (seconds < 0) {
    throw new Error('Seconds cannot be negative')
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds

  return `${minutes}:${formattedSeconds}`
}
