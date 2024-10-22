import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTracksStore } from '@/store/useTracksStore';
import { Playlist } from '@/lib/types';

function DeletePlaylistDialog({ data }: { data: Playlist }) {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const deletePlaylist = useTracksStore(state => state.deletePlaylist);

  const hanldeClickDelete = () => {
    deletePlaylist(data.id);

    if (playlistId == data.id.toString()) {
      navigate('/', { replace: true });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="opacity-0 group-hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete playlist</AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure to delete playlist "${data.title}"?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-8 bg-accent hover:bg-muted text-neutral-50 hover:text-neutral-50 border-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-8 bg-neutral-100 hover:bg-neutral-100/80 text-neutral-900"
            onClick={hanldeClickDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeletePlaylistDialog;
