export interface Track {
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
  isLiked: boolean;
  playlists: number[]; // contains only playlist id
}
export interface Playlist {
  id: number;
  title: string;
  description: string;
}

export type PlayingTrack = Pick<
  Track,
  | 'id'
  | 'artist_name'
  | 'name'
  | 'audiodownload'
  | 'image'
  | 'duration'
  | 'isLiked'
> & { index: number };
