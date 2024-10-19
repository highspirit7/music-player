import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
} from 'lucide-react';
import { decode } from 'html-entities';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import toMinutesAndSeconds from '@/utils/toMinuteAndSeconds';
import { useStore } from '@/store';
import { getNextIndex, getPrevIndex } from '@/utils/array';
import createPlayingTrack from '@/utils/createPlayingTrack';

function BottomControlBar() {
  const [volume, setVolume] = useState(0.5);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentPlayingList = useStore(state => state.currentPlayingList);
  const currentPlayingTrack = useStore(state => state.currentPlayingTrack);
  const isPlaying = useStore(state => state.isPlaying);
  const howlInstance = useStore(state => state.howlInstance);
  const currentPlayTime = useStore(state => state.currentPlayTime);

  const playTrack = useStore(state => state.playTrack);
  const pauseTrack = useStore(state => state.pauseTrack);
  const setCurrentPlayTime = useStore(state => state.setCurrentPlayTime);
  const setHowlInstance = useStore(state => state.setHowlInstance);
  const setCurrentPlayingTrack = useStore(
    state => state.setCurrentPlayingTrack
  );
  const toggleIsLiked = useStore(state => state.toggleIsLiked);

  function handleSkipForwardClick() {
    setCurrentPlayTime(0);

    if (isPlaying) pauseTrack();

    const nextTrackIndex = getNextIndex(
      currentPlayingList,
      currentPlayingTrack.index
    );

    if (nextTrackIndex >= 0) {
      setCurrentPlayingTrack(
        createPlayingTrack(currentPlayingList[nextTrackIndex], nextTrackIndex)
      );
      setHowlInstance(currentPlayingList[nextTrackIndex].audiodownload);
      playTrack();
    }
  }

  function handleSkipBackClick() {
    setCurrentPlayTime(0);

    if (isPlaying) pauseTrack();

    const prevTrackIndex = getPrevIndex(
      currentPlayingList,
      currentPlayingTrack.index
    );

    if (prevTrackIndex >= 0) {
      setCurrentPlayingTrack(
        createPlayingTrack(currentPlayingList[prevTrackIndex], prevTrackIndex)
      );
      setHowlInstance(currentPlayingList[prevTrackIndex].audiodownload);
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

  // TODO : currentPlayingList가 변할 때 대응 로직 추가
  // 위 로직을 추가하려면 현재 재생 중인 트랙 상태도 따로 관리해야하나 싶다.
  // 왜냐하면 currentPlayingList가 업데이트되었을 때 현재 재생 중인 트랙이 그 안에 있냐 없냐를 현재 구조로 체크할 수 가 없다..

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
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setCurrentPlayTime(Math.round(howlInstance.seek()));
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
    currentPlayingList,
    setHowlInstance,
    playTrack,
    setCurrentPlayTime,
    currentPlayingTrack.index,
    setCurrentPlayingTrack,
  ]);

  useEffect(() => {
    howlInstance?.volume(volume);
  }, [volume, howlInstance]);

  if (currentPlayingList.length > 0)
    return (
      <footer className="h-20 border-t bg-stone-700 p-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center space-x-4">
            <img
              src={currentPlayingTrack.image}
              alt="Now playing"
              className="w-12 h-12 rounded bg-muted"
            />
            <div>
              <h3 className="font-medium ">
                {decode(currentPlayingTrack.name)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {decode(currentPlayingTrack.artist_name)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 max-w-md">
            <div className="flex items-center space-x-4">
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
              <button
                onClick={() => toggleIsLiked(currentPlayingTrack.id)}
                className={`transition-colors ${currentPlayingTrack.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-white'}`}
              >
                <Heart
                  className="h-5 w-5"
                  fill={currentPlayingTrack.isLiked ? 'currentColor' : 'none'}
                />
                <span className="sr-only">
                  {currentPlayingTrack.isLiked ? 'Unlike' : 'Like'}
                </span>
              </button>
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
