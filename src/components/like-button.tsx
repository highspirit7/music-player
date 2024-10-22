import { Heart } from 'lucide-react';

import { PlayingTrack, Track } from '@/lib/types';
import { useTracksStore } from '@/store/useTracksStore';

function LikeButton({ track }: { track: PlayingTrack | Track }) {
  const toggleIsLiked = useTracksStore(state => state.toggleIsLiked);

  return (
    <button
      onClick={() => toggleIsLiked(track.id)}
      className={`transition-colors ${track.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-white'}`}
    >
      <Heart
        className="h-5 w-5"
        fill={track.isLiked ? 'currentColor' : 'none'}
      />
      <span className="sr-only">{track.isLiked ? 'Unlike' : 'Like'}</span>
    </button>
  );
}

export default LikeButton;
