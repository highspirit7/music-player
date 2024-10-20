import { Heart, Pause, Play } from 'lucide-react';
import { decode } from 'html-entities';

import toMinutesAndSeconds from '@/utils/toMinuteAndSeconds';
import { Track, useStore } from '@/store';
import createPlayingTrack from '@/utils/createPlayingTrack';

function TrackList({ tracks }: { tracks: Track[] }) {
  const isPlaying = useStore(state => state.isPlaying);
  const currentPlayingTrack = useStore(state => state.currentPlayingTrack);

  const setCurrentPlayTime = useStore(state => state.setCurrentPlayTime);
  const setCurrentPlayingTrack = useStore(
    state => state.setCurrentPlayingTrack
  );
  const setCurrentPlayingList = useStore(state => state.setCurrentPlayingList);
  const setHowlInstance = useStore(state => state.setHowlInstance);
  const playTrack = useStore(state => state.playTrack);
  const pauseTrack = useStore(state => state.pauseTrack);
  const toggleIsLiked = useStore(state => state.toggleIsLiked);

  function handleTrackClick(clickedTrack: Track, index: number) {
    if (isPlaying) pauseTrack();

    setCurrentPlayTime(0);
    setCurrentPlayingTrack(createPlayingTrack(clickedTrack, index));
    setCurrentPlayingList(tracks);
    setHowlInstance(clickedTrack.audiodownload);
    playTrack();
  }

  function handlePlayOrPauseClick() {
    if (isPlaying) pauseTrack();
    else playTrack();
  }

  return (
    <div className="grid gap-4 p-4">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md transition-opacity duration-200"
        >
          <div className="relative inline-block cursor-pointer group ">
            <img
              src={track.image}
              alt="Album cover"
              className="w-10 h-10 rounded bg-muted hover:bg-black hover:bg-opacity-50"
            />
            {currentPlayingTrack.id === track.id ? (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded"
                onClick={handlePlayOrPauseClick}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </div>
            ) : (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                onClick={() => handleTrackClick(track, index)}
              >
                <Play className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium">{decode(track.name)}</h3>
            <p className="text-sm text-muted-foreground">
              {decode(track.artist_name)}
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => toggleIsLiked(track.id)}
              className={`transition-colors ${track.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-white'}`}
            >
              <Heart
                className="h-5 w-5"
                fill={track.isLiked ? 'currentColor' : 'none'}
              />
              <span className="sr-only">
                {track.isLiked ? 'Unlike' : 'Like'}
              </span>
            </button>
            {/* 플레이리스트에서 제거할 수 있게 하는 버튼을 넣어야하고 favorites가 아닌 플레이리스트에서만 보이게 해야한다 */}
            <span className="ml-3 text-sm text-muted-foreground">
              {toMinutesAndSeconds(track.duration)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrackList;
