import { Pause, Play } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import SaveToPlaylistDialog from '@/components/mainContent/default/save-to-playlist-dialog';
import { useTracksStore } from '@/store/useTracksStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Track } from '@/lib/types';

function TrackCard({
  data,
  onNewTrackClick,
}: {
  data: Track;
  onNewTrackClick: () => void;
}) {
  const playlists = useTracksStore(state => state.playlists);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const currentPlayingTrack = usePlayerStore(
    state => state.currentPlayingTrack
  );

  const playTrack = usePlayerStore(state => state.playTrack);
  const pauseTrack = usePlayerStore(state => state.pauseTrack);

  return (
    <Card key={data.id} className="flex-shrink-0 w-48">
      <CardContent className="p-4">
        <div className="aspect-square relative mb-3  group">
          <img
            src={data.image}
            alt={`${data.name}_by_${data.artist_name}`}
            className="w-full h-full object-cover rounded-md"
          />
          {currentPlayingTrack.id === data.id ? (
            <div className="absolute inset-0 bg-black bg-opacity-50 grid grid-cols-3 grid-rows-3 rounded">
              {playlists.length > 0 && (
                <SaveToPlaylistDialog
                  isOnCard={true}
                  track={data}
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
                  track={data}
                  playlists={playlists}
                />
              )}
              <Play
                className="w-8 h-8 row-start-2 col-start-2 justify-self-center self-center cursor-pointer"
                onClick={onNewTrackClick}
              />
            </div>
          )}
        </div>
        <h3 className="font-semibold text-sm line-clamp-1">{data.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {data.artist_name}
        </p>
      </CardContent>
    </Card>
  );
}

export default TrackCard;
