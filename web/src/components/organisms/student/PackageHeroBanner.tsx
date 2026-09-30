import type * as React from "react";
import { SplitHero } from "@/components/molecules/hero";

export type PackageHeroVariant = "learning" | "practice";

export interface PackageHeroBannerProps {
  variant?: PackageHeroVariant;
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULTS: Record<
  PackageHeroVariant,
  { title: string; description: string; alt: string }
> = {
  learning: {
    title: "Module Bahasa Indonesia",
    description:
      "Pelajari berbagai module untuk membantu kamu memahami soal TKA Bahasa Indonesia. Dirancang terstruktur mencakup seluruh domain uji kompetensi nasional.",
    alt: "module Pembelajaran Siswa",
  },
  practice: {
    title: "Latihan Soal TKA Bahasa Indonesia",
    description:
      "Latih kemampuan membaca dan pahami berbagai jenis teks untuk menghadapi TKA Bahasa Indonesia. Kerjakan paket soal terstandardisasi dan evaluasi akurasi jawabanmu.",
    alt: "Latihan Soal Siswa",
  },
};

export function PackageHeroBanner({
  variant = "learning",
  title,
  description,
  className,
}: PackageHeroBannerProps) {
  const d = DEFAULTS[variant];
  return (
    <SplitHero
      title={title ?? d.title}
      description={description ?? d.description}
      illustrationAlt={d.alt}
      className={className}
    />
  );
}

export default PackageHeroBanner;
