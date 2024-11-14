import { memo } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'
import Playlists from './playlists'

const LeftSideBar = memo(function LeftSideBar() {
  return (
    <aside className="w-56 p-6 hidden md:block border-r border-border">
      <h1 className="text-2xl font-bold mb-6 text-primary">
        <Link to="/">TC-Music</Link>
      </h1>

      <nav className="space-y-4">
        <Link
          to="/favorites"
          className="flex items-center space-x-2 text-primary hover:text-primary/80"
        >
          <Heart className="h-5 w-5" />
          <span>Favorites</span>
        </Link>
      </nav>
      <Separator className="my-4" />
      <Playlists />
    </aside>
  )
})

export default LeftSideBar
