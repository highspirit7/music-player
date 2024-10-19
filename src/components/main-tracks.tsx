import { genres } from '@/lib/const';
import MusicCardList from './music-card-list';
import { useStore } from '@/store';

function MainTracks() {
  const mainTracks = useStore(state => state.mainTracks);
  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="sticky top-0 p-4 border-b border-border z-50 bg-background">
        <h1 className="text-2xl font-bold">Your Music</h1>
      </div>
      {genres.map(genre => (
        <MusicCardList tracks={mainTracks[genre]} genre={genre} key={genre} />
      ))}
    </main>
  );
}

export default MainTracks;
