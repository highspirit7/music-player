import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Heart, Library, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import BottomControlBar from '@/components/bottomControlBar';
import { useStore } from '@/store';

export default function App() {
  const fetchTracks = useStore(state => state.fetchTracks);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
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
            <a
              href="#"
              className="flex items-center space-x-2 text-primary hover:text-primary/80"
            >
              <Library className="h-5 w-5" />
              <span>Playlists</span>
            </a>
          </nav>
          <Separator className="my-4" />
          <div>
            <h2 className="text-lg font-semibold mb-4">Playlists</h2>
            <Button className="w-fit mb-4 py-1">
              <Plus className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                <a href="#" className="block text-sm hover:text-primary">
                  Chill Vibes
                </a>
                <a href="#" className="block text-sm hover:text-primary">
                  Workout Mix
                </a>
                <a href="#" className="block text-sm hover:text-primary">
                  Study Session
                </a>
                <a href="#" className="block text-sm hover:text-primary">
                  Road Trip Tunes
                </a>
                <a href="#" className="block text-sm hover:text-primary">
                  Throwback Hits
                </a>
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content Area */}
        <Outlet />
        {/* <main className="flex-1 overflow-auto bg-background">
          <div className="sticky top-0 p-4 border-b border-border z-50 bg-background">
            <h1 className="text-2xl font-bold">Your Music</h1>
          </div>
          {genres.map(genre => (
            <MusicCardList
              tracks={mainTracks[genre]}
              genre={genre}
              key={genre}
            />
          ))}
        </main> */}
      </div>
      <BottomControlBar />
    </div>
  );
}
