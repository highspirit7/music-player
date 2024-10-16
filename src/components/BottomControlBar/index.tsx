import {
  Play,
  Pause,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import toMinutesAndSeconds from '@/utils/toMinuteAndSeconds';
import { SelectedTrack, useStore } from '@/store';

function BottomControlBar({ track }: { track: SelectedTrack }) {
  const isPlaying = useStore(state => state.isPlaying);
  const playTrack = useStore(state => state.playTrack);
  const pauseTrack = useStore(state => state.pauseTrack);

  return (
    <footer className="h-20 border-t bg-stone-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={track.image}
            alt="Now playing"
            className="w-12 h-12 rounded bg-muted"
          />
          <div>
            <h3 className="font-medium">{track.name}</h3>
            <p className="text-sm text-muted-foreground">{track.artist_name}</p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <Button size="icon" variant="ghost">
              <Shuffle className="h-4 w-4" />
              <span className="sr-only">Shuffle</span>
            </Button>
            <Button size="icon" variant="ghost">
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10"
              onClick={isPlaying ? pauseTrack : playTrack}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}

              <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
            <Button size="icon" variant="ghost">
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Repeat className="h-4 w-4" />
              <span className="sr-only">Repeat</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2 w-full">
            <span className="text-sm text-muted-foreground">1:23</span>
            <Slider
              defaultValue={[33]}
              max={100}
              step={1}
              className="w-full"
            />{' '}
            <span>{toMinutesAndSeconds(track.duration)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <Slider defaultValue={[50]} max={100} step={1} className="w-24" />
        </div>
      </div>
    </footer>
  );
}

export default BottomControlBar;
