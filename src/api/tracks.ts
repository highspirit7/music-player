import { Track } from '@/store';

const BASE_URL = 'https://api.jamendo.com/v3.0';

export const getTracks = async (
  genre: string,
  datebetween: string = '2012-01-01_2024-10-01',
  limit: number = 10
): Promise<Omit<Track, 'isLiked'>[]> => {
  const response = await fetch(
    `${BASE_URL}/tracks/?client_id=${import.meta.env.VITE_JAMENDO_CLIENT_ID}&format=jsonpretty&datebetween=${datebetween}&limit=${limit}&tags=${[genre]}`
  );

  const data = await response.json();
  return data.results.filter((track: Track) => track.audiodownload !== '');
};
