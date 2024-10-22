import { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import VolumeSlider from './volume-slider';
import TrackInformation from './track-information';

import { usePlayerStore } from '@/store/usePlayerStore';

import {
  createPlayingTrack,
  getNextIndex,
  getPrevIndex,
  toMinutesAndSeconds,
} from '@/lib/utils';
import LikeButton from '../like-button';

function BottomControlBar() {
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentPlayingList = usePlayerStore(state => state.currentPlayingList);
  const currentPlayingTrack = usePlayerStore(
    state => state.currentPlayingTrack
  );
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const howlInstance = usePlayerStore(state => state.howlInstance);
  const currentPlayTime = usePlayerStore(state => state.currentPlayTime);

  const playTrack = usePlayerStore(state => state.playTrack);
  const pauseTrack = usePlayerStore(state => state.pauseTrack);
  const setCurrentPlayTime = usePlayerStore(state => state.setCurrentPlayTime);
  const setHowlInstance = usePlayerStore(state => state.setHowlInstance);
  const setCurrentPlayingTrack = usePlayerStore(
    state => state.setCurrentPlayingTrack
  );

  const handleSkipClick = (type: 'back' | 'forward') => {
    setCurrentPlayTime(0);

    if (isPlaying) pauseTrack();

    const newTrackIndex =
      type === 'back'
        ? getPrevIndex(currentPlayingList, currentPlayingTrack.index)
        : getNextIndex(currentPlayingList, currentPlayingTrack.index);

    if (newTrackIndex >= 0) {
      setCurrentPlayingTrack(
        createPlayingTrack(currentPlayingList[newTrackIndex], newTrackIndex)
      );
      setHowlInstance(currentPlayingList[newTrackIndex].audiodownload);
      playTrack();
    }
  };

  const onCurrentPlayTimeChange = (value: number[]) => {
    if (isPlaying) howlInstance?.pause();

    setCurrentPlayTime(value[0]);
  };

  const onCurrentPlayTimeCommit = (value: number[]) => {
    howlInstance?.seek(value[0]);
    if (isPlaying) howlInstance?.play();
  };

  useEffect(() => {
    if (howlInstance) {
      howlInstance.on('end', () => {
        clearInterval(intervalRef.current);
        const nextTrackIndex = getNextIndex(
          currentPlayingList,
          currentPlayingTrack.index
        );
        setCurrentPlayTime(0);

        if (nextTrackIndex >= 0) {
          setCurrentPlayingTrack(
            createPlayingTrack(
              currentPlayingList[nextTrackIndex],
              nextTrackIndex
            )
          );

          setHowlInstance(currentPlayingList[nextTrackIndex].audiodownload);
          playTrack();
        }
      });
    }

    return () => {
      howlInstance?.off('end');
    };
  }, [
    howlInstance,
    currentPlayingList,
    setHowlInstance,
    playTrack,
    setCurrentPlayTime,
    currentPlayingTrack.index,
    setCurrentPlayingTrack,
  ]);

  useEffect(() => {
    if (howlInstance) {
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setCurrentPlayTime(Math.round(howlInstance.seek()));
        }, 1000);
      } else clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [howlInstance, isPlaying, setCurrentPlayTime]);

  if (currentPlayingList.length > 0)
    return (
      <footer className="h-20 border-t bg-stone-700 p-4">
        <div className="grid grid-cols-3 items-center">
          <TrackInformation />
          <div className="flex flex-col items-center space-y-2 max-w-md">
            <div className="flex items-center space-x-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleSkipClick('back')}
              >
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
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleSkipClick('forward')}
              >
                <SkipForward className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <span className="text-sm text-muted-foreground min-w-[30px]">
                {toMinutesAndSeconds(currentPlayTime)}
              </span>
              <Slider
                defaultValue={[currentPlayTime]}
                value={[currentPlayTime]}
                max={currentPlayingTrack.duration}
                step={1}
                onValueChange={onCurrentPlayTimeChange}
                onValueCommit={onCurrentPlayTimeCommit}
                className="w-full"
              />{' '}
              <span className="text-sm text-muted-foreground min-w-[30px]">
                {toMinutesAndSeconds(currentPlayingTrack.duration)}
              </span>
              <LikeButton track={currentPlayingTrack} />
            </div>
          </div>
          <VolumeSlider />
        </div>
      </footer>
    );
}

export default BottomControlBar;
