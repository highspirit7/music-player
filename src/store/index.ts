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
}

// export type SelectedTrack = Pick<
//   Track,
//   'id' | 'artist_name' | 'image' | 'name' | 'duration' | 'audiodownload'
// > & { index: number };
type MainTracks = {
  [K in (typeof genres)[number]]: Track[];
};

interface State {
  mainTracks: MainTracks;
  playLists: Record<string, Track[]>;
  isPlaying: boolean;
  howlInstance: Howl | null;
  error: string | null;
  selectedList: Track[];
  currentTrackIndex: number;
  currentPlayTime: number;
  toggleIsPlaying: () => void;
  fetchTracks: () => void;
  // ? 다른 장르 리스트의 트랙을 선택할 때 그 선택하는 트랙 리스트 장르가 기존에 선택된 리스트의 장르와 다르다는 것을 감지할 수 있어야 한다.
  // 그냥 클릭한 트랙의 아이디가 현재 선택된 트랙 리스트에 있냐 없냐를 체크해서 없는 경우에만 전체 tracks를 업데이트하는 방향으로 가자
  setSelectedList: (tracks: Track[], index: number) => void;
  setCurrentTrackIndex: (index: number) => void;
  setHowlInstance: (src: string) => void;
  setCurrentPlayTime: (value: number) => void;
  playTrack: () => void;
  pauseTrack: () => void;
}

export const useStore = create<State>()(
  immer(
    devtools(set => ({
      mainTracks: { lofi: [], hiphop: [], pop: [], rock: [] },
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
              state.mainTracks[genre] = tracks;
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
    }))
  )
);
