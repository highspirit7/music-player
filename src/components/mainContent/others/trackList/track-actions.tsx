import { Trash2 } from 'lucide-react';

import LikeButton from '@/components/like-button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { toMinutesAndSeconds } from '@/lib/utils';
import { Track } from '@/lib/types';
import { useTracksStore } from '@/store/useTracksStore';

interface TrackActionsProps {
  data: Track;
  playlistId?: number;
}

function TrackActions({ data, playlistId }: TrackActionsProps) {
  const removeTrackFromPlaylist = useTracksStore(
    state => state.removeTrackFromPlaylist
  );

  return (
    <div className="flex items-center">
      <LikeButton track={data} />
      {playlistId && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="ml-2 text-muted-foreground hover:text-white transition-colors"
                onClick={() => removeTrackFromPlaylist(data.id, playlistId)}
              >
                <Trash2 className="w-5 h-5" />
                <span className="sr-only">Remove from playlist</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from this playlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <span className="ml-3 text-sm text-muted-foreground">
        {toMinutesAndSeconds(data.duration)}
      </span>
    </div>
  );
}

export default TrackActions;
