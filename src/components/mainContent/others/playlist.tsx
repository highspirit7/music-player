import { useMemo } from 'react';
import { Music2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

import TrackList from './trackList';
import { useTracksStore } from '@/store/useTracksStore';

function Playlist() {
  const { playlistId } = useParams();

  const mainTracks = useTracksStore(state => state.mainTracks);
  const playlists = useTracksStore(state => state.playlists);

  const tracksInPlaylist = useMemo(() => {
    return Object.values(mainTracks)
      .flat()
      .filter(track => {
        if (playlistId) {
          return track.playlists.includes(Number(playlistId));
        } else {
          return false;
        }
      });
  }, [mainTracks, playlistId]);
  const playlist = useMemo(
    () => playlists.filter(playlist => playlist.id === Number(playlistId))[0],
    [playlistId, playlists]
  );

  return (
    <main className="flex-1 overflow-auto bg-background flex flex-col">
      <div className="sticky top-0 p-4 border-b border-border z-50 bg-background">
        <h1 className="text-2xl font-bold">{playlist.title}</h1>
        {playlist.description && (
          <p className="text-md text-accent-foreground">
            {playlist.description}
          </p>
        )}
      </div>
      {tracksInPlaylist.length === 0 && Number(playlistId) > 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Music2 className="w-12 h-12 text-secondary-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tracks added yet</h3>
          <p className="text-sm text-muted-foreground">
            Please add some tracks to this playlist!'
          </p>
        </div>
      ) : (
        <TrackList tracks={tracksInPlaylist} playlistId={Number(playlistId)} />
      )}
    </main>
  );
}

export default Playlist;
