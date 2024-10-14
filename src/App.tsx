import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  Library,
  ListMusic,
  Plus,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-stone-600 text-neutral-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-card p-6 hidden md:block border-r border-border">
          <h1 className="text-2xl font-bold mb-6 text-primary">TC-Music</h1>
          <nav className="space-y-4">
            <a
              href="#"
              className="flex items-center space-x-2 text-primary hover:text-primary/80"
            >
              <Heart className="h-5 w-5" />
              <span>Favorites</span>
            </a>
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
        <main className="flex-1 overflow-auto p-6 bg-background">
          <h1 className="text-2xl font-bold mb-6">Your Music</h1>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md"
              >
                <img
                  src={`/placeholder.svg?height=40&width=40&text=Cover`}
                  alt="Album cover"
                  className="w-10 h-10 rounded bg-muted"
                />
                <div className="flex-1">
                  <h3 className="font-medium">Song Title {i}</h3>
                  <p className="text-sm text-muted-foreground">Artist Name</p>
                </div>
                <span className="text-sm text-muted-foreground">3:45</span>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Bottom Control Bar */}
      <footer className="h-20 border-t bg-stone-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/placeholder.svg?height=48&width=48&text=Cover"
              alt="Now playing"
              className="w-12 h-12 rounded bg-muted"
            />
            <div>
              <h3 className="font-medium">Current Song</h3>
              <p className="text-sm text-muted-foreground">Current Artist</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            <div className="flex items-center space-x-4">
              <Button size="icon" variant="ghost">
                <Shuffle className="h-4 w-4" />
                <span className="sr-only">Shuffle</span>
              </Button>
              <Button size="icon" variant="ghost">
                <SkipBack className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button size="icon" className="h-10 w-10">
                <ListMusic className="h-5 w-5" />
                <span className="sr-only">Play</span>
              </Button>
              <Button size="icon" variant="ghost">
                <SkipForward className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
              <Button size="icon" variant="ghost">
                <Repeat className="h-4 w-4" />
                <span className="sr-only">Repeat</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <span className="text-sm text-muted-foreground">1:23</span>
              <Slider
                defaultValue={[33]}
                max={100}
                step={1}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">3:45</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Slider defaultValue={[50]} max={100} step={1} className="w-24" />
          </div>
        </div>
      </footer>
    </div>
  );
}
