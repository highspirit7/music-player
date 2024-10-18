import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { decode } from 'html-entities';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import toMinutesAndSeconds from '@/utils/toMinuteAndSeconds';
import { useStore } from '@/store';
import { getNextIndex, getPrevIndex } from '@/utils/array';

function BottomControlBar() {
  const [volume, setVolume] = useState(0.5);
  const intervalRef = useRef<NodeJS.Timeout>();

  const selectedList = useStore(state => state.selectedList);
  const currentTrackIndex = useStore(state => state.currentTrackIndex);
  const isPlaying = useStore(state => state.isPlaying);
  const howlInstance = useStore(state => state.howlInstance);
  const currentPlayTime = useStore(state => state.currentPlayTime);
  const currentTrack = useMemo(
    () => selectedList[currentTrackIndex],
    [selectedList, currentTrackIndex]
  );

  const playTrack = useStore(state => state.playTrack);
  const pauseTrack = useStore(state => state.pauseTrack);
  const setCurrentPlayTime = useStore(state => state.setCurrentPlayTime);
  const setHowlInstance = useStore(state => state.setHowlInstance);
  const setCurrentTrackIndex = useStore(state => state.setCurrentTrackIndex);

  function handleSkipForwardClick() {
    setCurrentPlayTime(0);

    if (isPlaying) pauseTrack();

    const nextTrackIndex = getNextIndex(selectedList, currentTrackIndex);

    if (nextTrackIndex >= 0) {
      setCurrentTrackIndex(nextTrackIndex);
      setHowlInstance(selectedList[nextTrackIndex].audiodownload);
      playTrack();
    }
  }

  function handleSkipBackClick() {
    setCurrentPlayTime(0);

    if (isPlaying) pauseTrack();

    const prevTrackIndex = getPrevIndex(selectedList, currentTrackIndex);

    if (prevTrackIndex >= 0) {
      setCurrentTrackIndex(prevTrackIndex);
      setHowlInstance(selectedList[prevTrackIndex].audiodownload);
      playTrack();
    }
  }

  function onCurrentPlayTimeChange(value: number[]) {
    if (isPlaying) howlInstance?.pause();

    setCurrentPlayTime(value[0]);
  }

  function onCurrentPlayTimeCommit(value: number[]) {
    howlInstance?.seek(value[0]);
    if (isPlaying) howlInstance?.play();
  }

  useEffect(() => {
    if (howlInstance) {
      howlInstance.on('end', () => {
        clearInterval(intervalRef.current);
        const nextTrackIndex = getNextIndex(selectedList, currentTrackIndex);
        setCurrentPlayTime(0);

        if (nextTrackIndex >= 0) {
          setCurrentTrackIndex(nextTrackIndex);
          setHowlInstance(selectedList[nextTrackIndex].audiodownload);
          playTrack();
        }
      });
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setCurrentPlayTime(Math.round(howlInstance.seek()));
          //   console.log('setInterval', Math.round(howlInstance.seek()));
        }, 1000);
      } else clearInterval(intervalRef.current);
    }

    return () => {
      howlInstance?.off('end');
      clearInterval(intervalRef.current);
    };
  }, [
    isPlaying,
    howlInstance,
    currentTrackIndex,
    selectedList,
    setCurrentTrackIndex,
    setHowlInstance,
    playTrack,
    setCurrentPlayTime,
  ]);

  useEffect(() => {
    howlInstance?.volume(volume);
  }, [volume, howlInstance]);

  //   useEffect(() => {
  //     console.log('currentPlayTime', toMinutesAndSeconds(currentPlayTime));
  //   }, [currentPlayTime]);

  if (selectedList.length > 0)
    return (
      <footer className="h-20 border-t bg-stone-700 p-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center space-x-4">
            <img
              src={currentTrack.image}
              alt="Now playing"
              className="w-12 h-12 rounded bg-muted"
            />
            <div>
              <h3 className="font-medium ">{decode(currentTrack.name)}</h3>
              <p className="text-sm text-muted-foreground">
                {decode(currentTrack.artist_name)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 max-w-md">
            <div className="flex items-center space-x-4">
              <Button size="icon" variant="ghost">
                <Shuffle className="h-4 w-4" />
                <span className="sr-only">Shuffle</span>
              </Button>
              <Button size="icon" variant="ghost" onClick={handleSkipBackClick}>
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
                onClick={handleSkipForwardClick}
              >
                <SkipForward className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
              <Button size="icon" variant="ghost">
                <Repeat className="h-4 w-4" />
                <span className="sr-only">Repeat</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <span className="text-sm text-muted-foreground min-w-[30px]">
                {toMinutesAndSeconds(currentPlayTime)}
              </span>
              <Slider
                defaultValue={[currentPlayTime]}
                value={[currentPlayTime]}
                max={currentTrack.duration}
                step={1}
                onValueChange={onCurrentPlayTimeChange}
                onValueCommit={onCurrentPlayTimeCommit}
                className="w-full"
              />{' '}
              <span className="text-sm text-muted-foreground min-w-[30px]">
                {toMinutesAndSeconds(currentTrack.duration)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 justify-self-end">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Slider
              defaultValue={[volume]}
              max={1}
              step={0.1}
              onValueChange={value => setVolume(value[0])}
              className="w-24"
            />
          </div>
        </div>
      </footer>
    );
}

export default BottomControlBar;
