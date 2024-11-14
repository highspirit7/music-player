import { decode } from 'html-entities'

import { usePlayerStore } from '@/store/usePlayerStore'

function TrackInformation() {
  const currentPlayingTrack = usePlayerStore(state => state.currentPlayingTrack)
  return (
    <div className="flex items-center space-x-4">
      <img
        src={currentPlayingTrack.image}
        alt="Now playing"
        className="w-12 h-12 rounded bg-muted"
      />
      <div>
        <h3 className="font-medium ">{decode(currentPlayingTrack.name)}</h3>
        <p className="text-sm text-muted-foreground">{decode(currentPlayingTrack.artist_name)}</p>
      </div>
    </div>
  )
}

export default TrackInformation
