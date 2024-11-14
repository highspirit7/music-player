import { Howl } from 'howler'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

import { PlayingTrack, Track } from '@/lib/types'

interface PlayerState {
  isPlaying: boolean
  howlInstance: Howl | null
  currentPlayingTrack: PlayingTrack
  currentPlayingList: Track[]
  currentPlayTime: number
  setCurrentPlayingList: (tracks: Track[]) => void
  setCurrentPlayingTrack: (track: PlayingTrack) => void
  setHowlInstance: (src: string) => void
  setCurrentPlayTime: (value: number) => void
  playTrack: () => void
  pauseTrack: () => void
}

export const usePlayerStore = create<PlayerState>()(
  immer(
    devtools(set => ({
      isPlaying: false,
      howlInstance: null,

      currentPlayingList: [],
      currentPlayingTrack: {
        id: '',
        name: '',
        artist_name: '',
        audiodownload: '',
        image: '',
        duration: 0,
        isLiked: false,
        index: -1,
      } as PlayingTrack,
      currentPlayTime: 0,

      setCurrentPlayingList: (tracks: Track[]) => {
        set(state => {
          state.currentPlayingList = tracks
        })
      },
      setCurrentPlayingTrack: (track: PlayingTrack) => {
        set(state => {
          state.currentPlayingTrack = track
        })
      },
      setHowlInstance: (src: string) => {
        set(state => {
          state.howlInstance = new Howl({
            src: [src],
            html5: true,
          })
        })
      },
      setCurrentPlayTime: (value: number) => {
        set(state => {
          state.currentPlayTime = value
        })
      },
      playTrack: () => {
        set(state => {
          state.isPlaying = true
          state.howlInstance?.play()
        })
      },
      pauseTrack: () => {
        set(state => {
          state.isPlaying = false
          state.howlInstance?.pause()
        })
      },
    })),
  ),
)
