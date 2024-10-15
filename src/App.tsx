import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Heart, Library, Plus } from 'lucide-react';
import toMinutesAndSeconds from './utils/toMinuteAndSeconds';
import BottomControlBar from './components/BottomControlBar';

type Track = {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  artist_idstr: string;
  album_name: string;
  album_id: string;
  license_ccurl: string;
  position: number;
  releasedate: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  prourl: string;
  shorturl: string;
  shareurl: string;
  waveform: string;
  image: string;
  audiodownload_allowed: boolean;
};

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track>();

  useEffect(() => {
    async function getTracks(): Promise<Track[] | undefined> {
      try {
        const response = await fetch(
          'https://api.jamendo.com/v3.0/tracks/?client_id=399f3217&format=jsonpretty&datebetween=2012-01-01_2024-01-01&limit=20'
        );

        const data = await response.json();

        return data.results;
      } catch (error) {
        console.error(error);
        return;
      }
    }

    const fetchTracks = async () => {
      const tracks = await getTracks();
      if (tracks) setTracks(tracks);
    };

    fetchTracks(); // Call the async function
  }, []);

  function handleTrackClick(track: Track) {
    setSelectedTrack(track);
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 p-6 hidden md:block border-r border-border">
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
        <main className="flex-1 overflow-auto bg-background">
          <div className="sticky top-0 p-4 border-b border-border z-50 bg-background">
            <h1 className="text-2xl font-bold">Your Music</h1>
          </div>
          <div className="grid gap-4 p-4">
            {tracks.map(track => (
              <div
                key={track.id}
                className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md"
              >
                <img
                  src={track.image}
                  alt="Album cover"
                  className="w-10 h-10 rounded bg-muted cursor-pointer"
                  onClick={() => handleTrackClick(track)}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{track.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {track.artist_name}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {toMinutesAndSeconds(track.duration)}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
      {selectedTrack && <BottomControlBar track={selectedTrack} />}
    </div>
  );
}
