export type ARTextLabel = {
  value: string;
  color: string;
  position: string;
  scale: string;
};

export type ARExperienceConfig = {
  slug: string;
  title: string;
  tagline: string;
  activeTagline: string;
  accentColor: string;
  lockedLabel: string;
  targetSrc: string;
  model: {
    src: string;
    position: string;
    scale: string;
    hover?: { from: string; to: string; duration: number };
    autoRotate?: { duration: number };
  };
  audio?: { src: string; autoPlayOnTarget?: boolean };
  sceneText?: ARTextLabel[];
  listing: {
    description: string;
  };
};

export const AR_EXPERIENCES: ARExperienceConfig[] = [
  {
    slug: "kuromi",
    title: "TACTUS",
    tagline: "Unlock the AR experience.\nPoint your camera at the keychain.",
    activeTagline: "AR Experience",
    accentColor: "#FF6B35",
    lockedLabel: "Now Playing",
    targetSrc: "/ar/targets.mind",
    model: {
      src: "/models/kuromi.glb",
      position: "0 0.05 0.05",
      scale: "0.25 0.25 0.25",
      hover: { from: "0 0.03 0.05", to: "0 0.07 0.05", duration: 3000 },
    },
    audio: { src: "/audio/track.mp3", autoPlayOnTarget: true },
    sceneText: [
      { value: "TACTUS", color: "#FFFFFF", position: "0 -0.3 0.05", scale: "0.35 0.35 0.35" },
      { value: "NOW PLAYING", color: "#FF6B35", position: "0 0.32 0.05", scale: "0.2 0.2 0.2" },
    ],
    listing: {
      description: "Kuromi AR Demo",
    },
  },
];

export function getExperience(slug: string): ARExperienceConfig | undefined {
  return AR_EXPERIENCES.find((e) => e.slug === slug);
}
