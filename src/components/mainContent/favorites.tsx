import { useMemo } from 'react';
import { Music2 } from 'lucide-react';

import { useStore } from '@/store';
import TrackList from '../trackList';

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
      {likedTracks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Music2 className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tracks added yet</h3>
          <p className="text-sm text-muted-foreground">
            The tracks you click the 'like' button on will be added here.'
          </p>
        </div>
      ) : (
        <TrackList type="favorites" tracks={likedTracks} />
      )}
    </main>
  );
}

export default Favorites;
