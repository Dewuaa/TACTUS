import type { Metadata } from "next";
import ARSpaceBoi from "./ARSpaceBoi";

export const metadata: Metadata = {
  title: "AR Space Boi",
  description:
    "Point your camera at the Space Boi target to unlock an AR experience.",
};

export default function ARPage() {
  return <ARSpaceBoi />;
}
