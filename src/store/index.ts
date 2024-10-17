import { Howl } from 'howler';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import { assertError } from '@/utils/errors';

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
}

export type SelectedTrack = Pick<
  Track,
  'id' | 'artist_name' | 'image' | 'name' | 'duration' | 'audiodownload'
> & { index: number };

interface State {
  tracks: Track[];
  isPlaying: boolean;
  isLoading: boolean;
  howlInstance: Howl | null;
  error: string | null;
  selectedTrack: SelectedTrack | null;
  currentPlayTime: number;
  toggleIsPlaying: () => void;
  fetchTracks: () => Promise<void>;
  setSelectedTrack: (track: Track, index: number) => void;
  setHowlInstance: (src: string) => void;
  setCurrentPlayTime: (value: number) => void;
  playTrack: () => void;
  pauseTrack: () => void;
}

export const useStore = create<State>()(
  immer(
    devtools(set => ({
      tracks: [],
      isPlaying: false,
      isLoading: false,
      howlInstance: null,
      error: null,
      selectedTrack: null,
      currentPlayTime: 0,
      toggleIsPlaying: () => {
        set(state => {
          state.isPlaying = !state.isPlaying;
        });
      },
      fetchTracks: async () => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await fetch(
            'https://api.jamendo.com/v3.0/tracks/?client_id=399f3217&format=jsonpretty&datebetween=2012-01-01_2024-01-01&limit=20'
          );

          const data = await response.json();

          set(state => {
            state.isLoading = false;
            state.tracks = data.results;
          });
        } catch (error) {
          assertError(error);
          set(state => {
            state.error = error.message;
            state.isLoading = false;
          });
        }
      },
      setSelectedTrack: (track: Track, index: number) => {
        set(state => {
          state.selectedTrack = {
            id: track.id,
            name: track.name,
            artist_name: track.artist_name,
            image: track.image,
            duration: track.duration,
            audiodownload: track.audiodownload,
            index,
          };
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
    }))
  )
);
