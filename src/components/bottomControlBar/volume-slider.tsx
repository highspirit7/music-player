import { Volume2, VolumeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

function VolumeSlider() {
  const [volume, setVolume] = useState(0.5);

  const howlInstance = usePlayerStore(state => state.howlInstance);

  useEffect(() => {
    howlInstance?.volume(volume);
  }, [volume, howlInstance]);

  return (
    <div className="flex items-center space-x-2 justify-self-end">
      {volume === 0 ? (
        <VolumeOff className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Volume2 className="h-5 w-5 text-muted-foreground" />
      )}

      <Slider
        defaultValue={[volume]}
        max={1}
        step={0.1}
        onValueChange={value => setVolume(value[0])}
        className="w-24"
      />
    </div>
  );
}

export default VolumeSlider;
