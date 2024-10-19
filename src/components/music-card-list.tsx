import { Pause, Play } from 'lucide-react';
import { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Track, useStore } from '@/store';
import { genres } from '@/lib/const';

export default function MusicCardList({
  tracks,
  genre,
}: {
  tracks: Track[];
  genre: (typeof genres)[number];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const isPlaying = useStore(state => state.isPlaying);
  const selectedList = useStore(state => state.selectedList);
  const currentIndexInList = useStore(state => state.currentTrackIndex);
  const playTrack = useStore(state => state.playTrack);
  const pauseTrack = useStore(state => state.pauseTrack);
  const setSelectedList = useStore(state => state.setSelectedList);
  const setIndexInSelectedList = useStore(state => state.setCurrentTrackIndex);
  const setCurrentPlayTime = useStore(state => state.setCurrentPlayTime);
  const setHowlInstance = useStore(state => state.setHowlInstance);

  const handleClickArrowButton = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 192 + 16; // div tag width + gap width
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTrackClick = (clickedTrack: Track, indexInList: number) => {
    if (isPlaying) pauseTrack();

    setCurrentPlayTime(0);
    setIndexInSelectedList(indexInList);

    const isClickedTrackInSelectedList = selectedList.some(
      track => track.id === clickedTrack.id
    );
    if (!isClickedTrackInSelectedList) setSelectedList(tracks, indexInList);

    setHowlInstance(clickedTrack.audiodownload);
    playTrack();
  };

  const handlePlayOrPauseClick = () => {
    if (isPlaying) pauseTrack();
    else playTrack();
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{genre}</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            onClick={() => handleClickArrowButton('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => handleClickArrowButton('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-1 space-x-4 scrollbar-hide hover:scrollbar-default"
          onScroll={handleScroll}
        >
          {tracks.map((track, index) => (
            <Card key={track.id} className="flex-shrink-0 w-48">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-3 cursor-pointer group">
                  <img
                    src={track.image}
                    alt={`${track.name} by ${track.artist_name}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  {selectedList.some(
                    trackInSelectedList => trackInSelectedList.id === track.id
                  ) && currentIndexInList === index ? (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded"
                      onClick={handlePlayOrPauseClick}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8" />
                      )}
                    </div>
                  ) : (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      onClick={() => handleTrackClick(track, index)}
                    >
                      <Play className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm line-clamp-1">
                  {track.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {track.artist_name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
