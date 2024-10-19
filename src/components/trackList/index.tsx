import { Music2, Pause, Play } from 'lucide-react';
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

  if (tracks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Music2 className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No tracks added yet</h3>
        <p className="text-sm text-muted-foreground">
          The tracks you click the 'like' button on will be added here.'
        </p>
      </div>
    );
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
          <span className="text-sm text-muted-foreground">
            {toMinutesAndSeconds(track.duration)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default TrackList;
