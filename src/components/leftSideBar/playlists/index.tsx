import { Link } from 'react-router-dom'

import { ScrollArea } from '@/components/ui/scroll-area'
import DeletePlaylistDialog from './delete-playlist-dialog'
import NewPlaylistPopover from './new-playlist-popover'
import { useTracksStore } from '@/store/useTracksStore'

function Playlists() {
  const playlists = useTracksStore(state => state.playlists)

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Playlists</h2>
      <NewPlaylistPopover />
      <ScrollArea className="h-[300px]">
        <ul className="space-y-2">
          {playlists.map(playlist => (
            <li
              className="flex items-center justify-between hover:bg-muted rounded-md p-2 group"
              key={playlist.id}
            >
              <Link className="truncate" to={`/playlist/${playlist.id}`}>
                {playlist.title}
              </Link>
              <DeletePlaylistDialog data={playlist} />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}

export default Playlists
