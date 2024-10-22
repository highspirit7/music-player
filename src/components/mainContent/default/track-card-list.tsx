import { useState, useRef } from 'react';
import { Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SaveToPlaylistDialog from '@/components/mainContent/default/save-to-playlist-dialog';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useTracksStore } from '@/store/useTracksStore';
import { genres } from '@/lib/const';
import { Track } from '@/lib/types';
import { createPlayingTrack } from '@/lib/utils';

export default function TrackCardList({
  tracks,
  genre,
}: {
  tracks: Track[];
  genre: (typeof genres)[number];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const playlists = useTracksStore(state => state.playlists);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const currentPlayingList = usePlayerStore(state => state.currentPlayingList);
  const currentPlayingTrack = usePlayerStore(
    state => state.currentPlayingTrack
  );

  const playTrack = usePlayerStore(state => state.playTrack);
  const pauseTrack = usePlayerStore(state => state.pauseTrack);
  const setCurrentPlayingList = usePlayerStore(
    state => state.setCurrentPlayingList
  );
  const setCurrentPlayingTrack = usePlayerStore(
    state => state.setCurrentPlayingTrack
  );
  const setCurrentPlayTime = usePlayerStore(state => state.setCurrentPlayTime);
  const setHowlInstance = usePlayerStore(state => state.setHowlInstance);

  const handleClickArrowButton = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 192 + 16; // div tag width + gap width
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTrackClick = (clickedTrack: Track, index: number) => {
    if (isPlaying) pauseTrack();

    setCurrentPlayTime(0);
    setCurrentPlayingTrack(createPlayingTrack(clickedTrack, index));

    const isClickedTrackInSelectedList = currentPlayingList.some(
      track => track.id === clickedTrack.id
    );
    if (!isClickedTrackInSelectedList) setCurrentPlayingList(tracks);

    setHowlInstance(clickedTrack.audiodownload);
    playTrack();
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
                <div className="aspect-square relative mb-3  group">
                  <img
                    src={track.image}
                    alt={`${track.name} by ${track.artist_name}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  {currentPlayingTrack.id === track.id ? (
                    <div className="absolute inset-0 bg-black bg-opacity-50 grid grid-cols-3 grid-rows-3 rounded">
                      {playlists.length > 0 && (
                        <SaveToPlaylistDialog
                          isOnCard={true}
                          track={track}
                          playlists={playlists}
                        />
                      )}
                      {isPlaying ? (
                        <Pause
                          className="w-8 h-8 row-start-2 col-start-2 justify-self-center self-center cursor-pointer"
                          onClick={() => pauseTrack()}
                        />
                      ) : (
                        <Play
                          className="w-8 h-8 row-start-2 col-start-2 justify-self-center self-center cursor-pointer"
                          onClick={() => playTrack()}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 grid grid-cols-3 grid-rows-3">
                      {playlists.length > 0 && (
                        <SaveToPlaylistDialog
                          isOnCard={true}
                          track={track}
                          playlists={playlists}
                        />
                      )}
                      <Play
                        className="w-8 h-8 row-start-2 col-start-2 justify-self-center self-center cursor-pointer"
                        onClick={() => handleTrackClick(track, index)}
                      />
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
