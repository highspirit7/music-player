import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

import { getTracks } from '@/api/tracks'
import { assertError } from '@/lib/utils'
import { genres } from '@/lib/const'
import { Playlist, Track } from '@/lib/types'
import { usePlayerStore } from './usePlayerStore'

type MainTracks = {
  [K in (typeof genres)[number]]: Track[]
}

interface TracksState {
  mainTracks: MainTracks
  error: string | null
  playlists: Playlist[]
  fetchTracks: () => void
  toggleIsLiked: (trackId: string) => void
  createPlaylist: (playlist: Playlist) => void
  deletePlaylist: (playlistId: number) => void
  addTrackToPlaylist: (trackId: string, playlistId: number) => void
  removeTrackFromPlaylist: (trackId: string, playlistId: number) => void
}

export const useTracksStore = create<TracksState>()(
  immer(
    devtools(set => ({
      mainTracks: { lofi: [], hiphop: [], pop: [], rock: [] } as MainTracks,
      error: null,
      playlists: [] as Playlist[],
      fetchTracks: async () => {
        set(state => {
          state.error = null
        })

        try {
          const trackPromises = genres.map(async genre => {
            const tracks = await getTracks(genre)
            return { genre, tracks }
          })

          const results = await Promise.all(trackPromises)

          set(state => {
            results.forEach(({ genre, tracks }) => {
              state.mainTracks[genre] = tracks.map(track =>
                Object.assign(track, {
                  isLiked: false,
                  playlists: [] as number[],
                }),
              )
            })
          })
        } catch (error) {
          assertError(error)
          set(state => {
            state.error = error.message
          })
        }
      },
      toggleIsLiked: (trackId: string) => {
        set(state => {
          ;(genres as ReadonlyArray<(typeof genres)[number]>).forEach(genre => {
            const trackIndex = state.mainTracks[genre].findIndex(track => track.id === trackId)

            if (trackIndex !== -1) {
              state.mainTracks[genre][trackIndex].isLiked =
                !state.mainTracks[genre][trackIndex].isLiked
            }
          })

          usePlayerStore.setState(state => {
            const trackIndex = state.currentPlayingList.findIndex(track => track.id === trackId)
            if (trackIndex !== -1) {
              state.currentPlayingList[trackIndex].isLiked =
                !state.currentPlayingList[trackIndex].isLiked
            }

            if (state.currentPlayingTrack.id === trackId) {
              state.currentPlayingTrack.isLiked = !state.currentPlayingTrack.isLiked
            }
            return state
          })
        })
      },
      createPlaylist: (playlist: Playlist) => {
        set(state => {
          state.playlists.push(playlist)
        })
      },
      deletePlaylist: (id: number) => {
        set(state => {
          const playlistIndex = state.playlists.findIndex(playlist => playlist.id === id)
          if (playlistIndex !== -1) {
            state.playlists.splice(playlistIndex, 1)
          }

          ;(genres as ReadonlyArray<(typeof genres)[number]>).forEach(genre => {
            state.mainTracks[genre].forEach(track => {
              track.playlists = track.playlists.filter(playlistId => playlistId !== id)
            })
          })
        })
      },
      addTrackToPlaylist: (trackId: string, playlistId: number) => {
        set(state => {
          ;(genres as ReadonlyArray<(typeof genres)[number]>).forEach(genre => {
            const trackIndex = state.mainTracks[genre].findIndex(track => track.id === trackId)

            if (trackIndex !== -1) {
              state.mainTracks[genre][trackIndex].playlists.push(playlistId)
            }
          })
        })
      },
      removeTrackFromPlaylist: (trackId: string, playlistId: number) => {
        set(state => {
          ;(genres as ReadonlyArray<(typeof genres)[number]>).forEach(genre => {
            const trackIndex = state.mainTracks[genre].findIndex(track => track.id === trackId)

            if (trackIndex !== -1) {
              state.mainTracks[genre][trackIndex].playlists = state.mainTracks[genre][
                trackIndex
              ].playlists.filter(id => playlistId !== id)
            }
          })
        })
      },
    })),
  ),
)
