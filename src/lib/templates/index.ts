import type { ComponentType } from "react";
import type { Customer, CustomerImage } from "@/lib/db/types";
import { BirthdayTemplate } from "./birthday";
import { LoveTemplate } from "./love";
import { FriendshipTemplate } from "./friendship";
import { AnniversaryTemplate } from "./anniversary";

export type TemplateProps = {
  customer: Customer;
  images: CustomerImage[];
};

export type Template = {
  id: string;
  name: string;
  description: string;
  component: ComponentType<TemplateProps>;
};

export const TEMPLATES: Template[] = [
  {
    id: "birthday",
    name: "Birthday",
    description: "Pastel confetti palette. Playful, bright, celebratory.",
    component: BirthdayTemplate,
  },
  {
    id: "love",
    name: "Love",
    description: "Rose & burgundy with drifting hearts. Soft and cinematic.",
    component: LoveTemplate,
  },
  {
    id: "friendship",
    name: "Friendship",
    description: "Deep galaxy with gold stars. Cosmic and intimate.",
    component: FriendshipTemplate,
  },
  {
    id: "anniversary",
    name: "Anniversary",
    description: "Warm gold & candlelight. Elegant and timeless.",
    component: AnniversaryTemplate,
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
