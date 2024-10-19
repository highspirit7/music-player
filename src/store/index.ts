import { Howl } from 'howler';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import { assertError } from '@/utils/errors';
import { getTracks } from '@/api/tracks';
import { genres } from '@/lib/const';

export interface Track {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  artist_idstr: string;
  album_name: string;
  album_id: string;
  license_ccurl: string;
  position: number;
  releasedate: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  prourl: string;
  shorturl: string;
  shareurl: string;
  waveform: string;
  image: string;
  audiodownload_allowed: boolean;
  isLiked: boolean;
}

type MainTracks = {
  [K in (typeof genres)[number]]: Track[];
};

interface State {
  mainTracks: MainTracks;
  isPlaying: boolean;
  howlInstance: Howl | null;
  error: string | null;
  selectedList: Track[];
  currentTrackIndex: number;
  currentPlayTime: number;
  toggleIsPlaying: () => void;
  fetchTracks: () => void;
  setSelectedList: (tracks: Track[], index: number) => void;
  setCurrentTrackIndex: (index: number) => void;
  setHowlInstance: (src: string) => void;
  setCurrentPlayTime: (value: number) => void;
  playTrack: () => void;
  pauseTrack: () => void;
  toggleIsLiked: (trackId: string) => void;
}

// TODO: like, unlike 하는 액션 필요

export const useStore = create<State>()(
  immer(
    devtools(set => ({
      mainTracks: { lofi: [], hiphop: [], pop: [], rock: [] } as MainTracks,
      playLists: {},
      isPlaying: false,
      howlInstance: null,
      error: null,
      selectedList: [],
      currentTrackIndex: 0,
      currentPlayTime: 0,
      toggleIsPlaying: () => {
        set(state => {
          state.isPlaying = !state.isPlaying;
        });
      },
      fetchTracks: async () => {
        set(state => {
          state.error = null;
        });

        try {
          const trackPromises = genres.map(async genre => {
            const tracks = await getTracks(genre);
            return { genre, tracks };
          });

          const results = await Promise.all(trackPromises);

          set(state => {
            results.forEach(({ genre, tracks }) => {
              state.mainTracks[genre] = tracks.map(track =>
                Object.assign(track, { isLiked: false })
              );
            });
          });
        } catch (error) {
          assertError(error);
          set(state => {
            state.error = error.message;
          });
        }
      },

      setSelectedList: (tracks: Track[], index: number) => {
        set(state => {
          state.selectedList = tracks;
          state.currentTrackIndex = index;
        });
      },
      setCurrentTrackIndex: (index: number) => {
        set(state => {
          state.currentTrackIndex = index;
        });
      },
      setHowlInstance: (src: string) => {
        set(state => {
          state.howlInstance = new Howl({
            src: [src],
            html5: true,
          });
        });
      },
      setCurrentPlayTime: (value: number) => {
        set(state => {
          state.currentPlayTime = value;
        });
      },
      playTrack: () => {
        set(state => {
          state.isPlaying = true;
          state.howlInstance?.play();
        });
      },
      pauseTrack: () => {
        set(state => {
          state.isPlaying = false;
          state.howlInstance?.pause();
        });
      },
      toggleIsLiked: (trackId: string) => {
        set(state => {
          (genres as ReadonlyArray<(typeof genres)[number]>).forEach(genre => {
            const trackIndex = state.mainTracks[genre].findIndex(
              track => track.id === trackId
            );

            if (trackIndex !== -1) {
              state.mainTracks[genre][trackIndex].isLiked =
                !state.mainTracks[genre][trackIndex].isLiked;
            }
          });

          const selectedTrackIndex = state.selectedList.findIndex(
            track => track.id === trackId
          );
          if (selectedTrackIndex !== -1) {
            state.selectedList[selectedTrackIndex].isLiked =
              !state.selectedList[selectedTrackIndex].isLiked;
          }
        });
      },
    }))
  )
);
