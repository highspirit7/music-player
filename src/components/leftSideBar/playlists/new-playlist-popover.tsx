import { useState } from 'react'
import { memo } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useTracksStore } from '@/store/useTracksStore'

const NewPlaylistPopover = memo(function NewPlaylistPopover() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const playlists = useTracksStore(state => state.playlists)
  const createPlaylist = useTracksStore(state => state.createPlaylist)

  const handleClickCreate = () => {
    const lastPlaylistId = playlists.length === 0 ? 0 : playlists[playlists.length - 1].id
    createPlaylist({ id: lastPlaylistId + 1, title, description })
    setTitle('')
    setDescription('')
    setOpen(false)
  }

  const handleClickCancel = () => {
    setTitle('')
    setDescription('')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-fit mb-4 py-1">
          <Plus className="h-4 w-4 mr-2" />
          New Playlist
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Playlist</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for your new playlist.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              className="w-auto py-1"
              placeholder="My Awesome Playlist"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="w-auto"
              placeholder="A collection of my favorite tunes"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button className="h-6 bg-accent hover:bg-muted" onClick={handleClickCancel}>
              Cancel
            </Button>
            <Button variant="secondary" className="h-6" onClick={handleClickCreate}>
              Create
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
})

export default NewPlaylistPopover
