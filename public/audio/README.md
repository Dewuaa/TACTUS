# /public/audio/

Place your audio file here:

- **track.mp3** — The audio file that auto-plays when the AR image target is detected.

The AR player in `/src/app/ar/retro-player/ARRetroPlayer.tsx` references this file at `/audio/track.mp3`.

## Notes

- The audio will auto-play when the camera detects the image target.
- Users can pause/resume using the on-screen controls.
- Audio loops continuously by default.
