import { Volume2, VolumeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

function VolumeSlider() {
  const [volume, setVolume] = useState(0.5);
  const volumeCopy = useRef(0);
  const howlInstance = usePlayerStore(state => state.howlInstance);

  useEffect(() => {
    howlInstance?.volume(volume);
  }, [volume, howlInstance]);

  useEffect(() => {
    if (volume !== 0) volumeCopy.current = volume;
  }, [volume]);

  return (
    <div className="flex items-center space-x-2 justify-self-end">
      <button onClick={() => setVolume(volume === 0 ? volumeCopy.current : 0)}>
        {volume === 0 ? (
          <VolumeOff className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Volume2 className="h-5 w-5 text-muted-foreground" />
        )}

        <span className="sr-only">
          {volume === 0 ? 'Volume Off' : 'Volume On'}
        </span>
      </button>
      <Slider
        defaultValue={[volume]}
        value={[volume]}
        max={1}
        step={0.1}
        onValueChange={value => setVolume(value[0])}
        className="w-24"
      />
    </div>
  );
}

export default VolumeSlider;
