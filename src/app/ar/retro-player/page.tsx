import type { Metadata } from "next";
import ARRetroPlayer from "./ARRetroPlayer";

export const metadata: Metadata = {
  title: "AR Retro Player",
  description:
    "Point your camera at the TACTUS keychain to unlock an AR experience.",
};

export default function ARPage() {
  return <ARRetroPlayer />;
}
