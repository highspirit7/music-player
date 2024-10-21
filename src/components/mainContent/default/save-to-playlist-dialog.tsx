import { useState } from 'react';
import { ListPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Playlist, Track, useStore } from '@/store';
import clsx from 'clsx';

function SaveToPlaylistDialog({
  isOnCard,
  track,
  playlists,
}: {
  isOnCard: boolean;
  track: Track;
  playlists: Playlist[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');

  const addTrackToPlaylist = useStore(state => state.addTrackToPlaylist);

  const handleClickSave = () => {
    if (selectedPlaylistId) {
      addTrackToPlaylist(track.id, Number(selectedPlaylistId));
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={clsx(
            'p-2',
            'm-1',
            'col-start-3',
            'row-start-1',
            'justify-self-end',
            'self-start',
            'bg-stone-900',
            'bg-opacity-0',
            'group-hover:opacity-100',
            'hover:bg-opacity-20',
            'transition-opacity',
            'duration-200',
            'rounded-full',
            {
              'opacity-0': isOnCard,
            }
          )}
          title="Click to save to playlist"
        >
          <ListPlus className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Save to Playlist
          </DialogTitle>
          <DialogDescription>
            {`Choose a playlist to save "${track.name}" by ${track.artist_name}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 w-96">
          <Select onValueChange={setSelectedPlaylistId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a playlist" />
            </SelectTrigger>
            <SelectContent>
              {playlists.map(playlist => (
                <SelectItem key={playlist.id} value={playlist.id.toString()}>
                  {playlist.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleClickSave}
            disabled={!selectedPlaylistId}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SaveToPlaylistDialog;
