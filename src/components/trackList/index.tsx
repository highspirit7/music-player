import { Heart, Pause, Play, Trash2 } from 'lucide-react';
import { decode } from 'html-entities';

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useTracksStore } from '@/store/useTracksStore';
import { Track } from '@/lib/types';
import { createPlayingTrack, toMinutesAndSeconds } from '@/lib/utils';

interface TrackListProps {
  tracks: Track[];
  playlistId?: number;
}

function TrackList({ tracks, playlistId }: TrackListProps) {
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const currentPlayingTrack = usePlayerStore(
    state => state.currentPlayingTrack
  );

  const setCurrentPlayTime = usePlayerStore(state => state.setCurrentPlayTime);
  const setCurrentPlayingTrack = usePlayerStore(
    state => state.setCurrentPlayingTrack
  );
  const setCurrentPlayingList = usePlayerStore(
    state => state.setCurrentPlayingList
  );
  const setHowlInstance = usePlayerStore(state => state.setHowlInstance);
  const playTrack = usePlayerStore(state => state.playTrack);
  const pauseTrack = usePlayerStore(state => state.pauseTrack);
  const toggleIsLiked = useTracksStore(state => state.toggleIsLiked);
  const removeTrackFromPlaylist = useTracksStore(
    state => state.removeTrackFromPlaylist
  );

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
            {playlistId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="ml-2 text-muted-foreground hover:text-white transition-colors"
                      onClick={() =>
                        removeTrackFromPlaylist(track.id, playlistId)
                      }
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="sr-only">Remove from playlist</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove from this playlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
