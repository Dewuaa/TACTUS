import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AR_EXPERIENCES, getExperience } from "@/lib/arExperiences";
import { ARExperience } from "@/components/ar/ARExperience";

export function generateStaticParams() {
  return AR_EXPERIENCES.map((exp) => ({ slug: exp.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperience(slug);
  if (!exp) return {};
  return {
    title: `${exp.title} AR`,
    description: "Point your camera at the TACTUS keychain to unlock an AR experience.",
  };
}

export default async function ARExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getExperience(slug);
  if (!config) notFound();
  return <ARExperience config={config} />;
}
