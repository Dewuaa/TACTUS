import type { Metadata } from "next";
import PlayClient from "./PlayClient";

export const metadata: Metadata = {
  title: "Now Playing",
  description: "Tap to play — powered by TACTUS phygital keychains.",
};

export default function PlayPage() {
  return <PlayClient />;
}
