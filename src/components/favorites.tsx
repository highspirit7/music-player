import { useMemo } from 'react';
import { useStore } from '@/store';
import TrackList from './trackList';

function Favorites() {
  const mainTracks = useStore(state => state.mainTracks);

  const likedTracks = useMemo(() => {
    return Object.values(mainTracks)
      .flat()
      .filter(track => track.isLiked);
  }, [mainTracks]);

  return (
    <main className="flex-1 overflow-auto bg-background flex flex-col">
      <div className="sticky top-0 p-4 border-b border-border z-50 bg-background">
        <h1 className="text-2xl font-bold">Favorites</h1>
      </div>
      <TrackList tracks={likedTracks} />
    </main>
  );
}

export default Favorites;
