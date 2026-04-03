# /public/ar/

Place your MindAR image target file here:

- **targets.mind** — The compiled MindAR image target file.

The AR scene in `/src/app/ar/retro-player/ARRetroPlayer.tsx` references this file at `/ar/targets.mind`.

## How to create a .mind target file

1. Go to the MindAR Image Target Compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. Upload your reference image (the cassette tape / keychain design).
3. Click "Start" to compile.
4. Download the resulting `.mind` file.
5. Rename it to `targets.mind` and place it in this directory.

## Tips for good image targets

- High contrast images work best
- Images with lots of unique features (corners, edges) track better
- Avoid repetitive patterns or solid color areas
- The target should be at least 300x300 pixels
