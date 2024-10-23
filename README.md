User-friendly music player app

# How to run this project on your local environment

- `npm install`
- setup .env file based on .env.example file.
  - Need client id of your application in [Jamendo api](https://devportal.jamendo.com)
- `npm run dev`

# Features

- display list of songs by 4 genres(royalty-free musics from Jamendo API)
- bottom track controller
  - play / pause
  - skip forward, skip back
  - like button
  - volume slider
- playlists
  - create a playlist
  - delete a playlist
  - add a track to a playlist
  - remove a track from a playlist

_You can only skip tracks in the selected list. For example, if you select any track in 'lofi' list on main page, you can only skip tracks with the 'lofi' list. And the same rule applies to the favorites list(the tracks you like) and any playlist you create._

# Used tech stacks

- zustand : https://zustand.docs.pmnd.rs/getting-started/introduction
- howler : https://howlerjs.com/
- shacdn/ui : https://ui.shadcn.com/
- tailwindcss : https://tailwindcss.com/

# Deplayed app in production

https://tc-music-player.vercel.app/
