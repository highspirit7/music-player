import { PlayingTrack, Track } from '@/store';

const createPlayingTrack = (track: Track, index: number): PlayingTrack => {
  const { id, artist_name, name, image, audiodownload, duration, isLiked } =
    track;

  return {
    id,
    name,
    artist_name,
    image,
    audiodownload,
    duration,
    isLiked,
    index,
  };
};

export default createPlayingTrack;
