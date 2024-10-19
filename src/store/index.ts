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

export type PlayingTrack = Pick<
  Track,
  | 'id'
  | 'artist_name'
  | 'name'
  | 'audiodownload'
  | 'image'
  | 'duration'
  | 'isLiked'
> & { index: number };

type MainTracks = {
  [K in (typeof genres)[number]]: Track[];
};

interface State {
  mainTracks: MainTracks;
  isPlaying: boolean;
  howlInstance: Howl | null;
  error: string | null;
  currentPlayingTrack: PlayingTrack;
  currentPlayingList: Track[];
  currentPlayTime: number;
  toggleIsPlaying: () => void;
  fetchTracks: () => void;
  setCurrentPlayingList: (tracks: Track[]) => void;
  setCurrentPlayingTrack: (track: PlayingTrack) => void;
  setHowlInstance: (src: string) => void;
  setCurrentPlayTime: (value: number) => void;
  playTrack: () => void;
  pauseTrack: () => void;
  toggleIsLiked: (trackId: string) => void;
}

export const useStore = create<State>()(
  immer(
    devtools(set => ({
      mainTracks: { lofi: [], hiphop: [], pop: [], rock: [] } as MainTracks,
      isPlaying: false,
      howlInstance: null,
      error: null,
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
      setCurrentPlayingList: (tracks: Track[]) => {
        set(state => {
          state.currentPlayingList = tracks;
        });
      },
      setCurrentPlayingTrack: (track: PlayingTrack) => {
        set(state => {
          state.currentPlayingTrack = track;
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

          const clickedTrackIndex = state.currentPlayingList.findIndex(
            track => track.id === trackId
          );
          if (clickedTrackIndex !== -1) {
            state.currentPlayingList[clickedTrackIndex].isLiked =
              !state.currentPlayingList[clickedTrackIndex].isLiked;
          }
          if (state.currentPlayingTrack.index > -1) {
            state.currentPlayingTrack.isLiked =
              !state.currentPlayingTrack.isLiked;
          }
        });
      },
    }))
  )
);
