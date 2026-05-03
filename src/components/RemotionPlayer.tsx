"use client";

import { Player } from "@remotion/player";
import { SlideshowPreview, SLIDESHOW_TOTAL_FRAMES } from "@/remotion/SlideshowPreview";

export default function RemotionSlideshowPlayer() {
  return (
    <Player
      component={SlideshowPreview}
      durationInFrames={SLIDESHOW_TOTAL_FRAMES}
      compositionWidth={390}
      compositionHeight={844}
      fps={30}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
      }}
      autoPlay
      loop
      controls={false}
      showVolumeControls={false}
      clickToPlay={false}
    />
  );
}
