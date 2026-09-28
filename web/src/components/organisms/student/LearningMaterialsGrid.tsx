import type * as React from 'react';
import { DashboardGrid } from '@/components/molecules/grid';
import { MaterialCard } from '@/components/molecules/student/MaterialCard';

export interface DashboardMaterialItem {
  id: string;
  title: string;
  description: string;
}

export interface LearningMaterialsGridProps {
  materials?: DashboardMaterialItem[];
  isLoading?: boolean;
  onLearnMaterial?: (materialId: string) => void;
  onViewAllMaterials?: () => void;
  allMaterialsHref?: string;
  className?: string;
}

export function LearningMaterialsGrid({
  materials,
  isLoading,
  onLearnMaterial,
  onViewAllMaterials,
  allMaterialsHref = '/student/learning',
  className,
}: LearningMaterialsGridProps) {
  // Visual illustrations designed in vector SVG
  const BookIllustration = (
    <svg
      viewBox="0 0 160 100"
      className="w-28 h-20 drop-shadow-xs"
      fill="none"
      role="img"
      aria-label="Ilustrasi Buku"
    >
      <title>Ilustrasi Buku</title>
      <rect
        x="25"
        y="20"
        width="50"
        height="60"
        rx="4"
        fill="#FFFFFF"
        stroke="#0284C7"
        strokeWidth="2.5"
      />
      <rect
        x="85"
        y="20"
        width="50"
        height="60"
        rx="4"
        fill="#FFFFFF"
        stroke="#0284C7"
        strokeWidth="2.5"
      />
      {/* Spine / Book binding */}
      <path d="M75 16 L85 16 L85 82 L75 82 Z" fill="#F7CE46" stroke="#D97706" strokeWidth="1.5" />
      {/* Lines on left page */}
      <line
        x1="33"
        y1="32"
        x2="67"
        y2="32"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="33"
        y1="42"
        x2="67"
        y2="42"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="33"
        y1="52"
        x2="55"
        y2="52"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Lines on right page */}
      <line
        x1="93"
        y1="32"
        x2="127"
        y2="32"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="93"
        y1="42"
        x2="127"
        y2="42"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="93"
        y1="52"
        x2="115"
        y2="52"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Bookmark ribbon */}
      <path d="M78 16 L82 16 L82 45 L80 41 L78 45 Z" fill="#E11D48" />
    </svg>
  );

  const DocumentIllustration = (
    <svg
      viewBox="0 0 160 100"
      className="w-28 h-20 drop-shadow-xs"
      fill="none"
      role="img"
      aria-label="Ilustrasi Dokumen"
    >
      <title>Ilustrasi Dokumen</title>
      {/* Document page */}
      <rect
        x="42"
        y="16"
        width="60"
        height="68"
        rx="6"
        fill="#FFFFFF"
        stroke="#0D9488"
        strokeWidth="2.5"
      />
      {/* Header bar */}
      <rect
        x="50"
        y="24"
        width="22"
        height="18"
        rx="4"
        fill="#E0F7FA"
        stroke="#0D9488"
        strokeWidth="1.5"
      />
      <circle cx="61" cy="31" r="4" fill="#0D9488" />
      <line
        x1="54"
        y1="39"
        x2="68"
        y2="39"
        stroke="#0D9488"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Paragraph lines */}
      <line
        x1="77"
        y1="28"
        x2="94"
        y2="28"
        stroke="#F7CE46"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="77"
        y1="36"
        x2="94"
        y2="36"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="94"
        y2="50"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="58"
        x2="94"
        y2="58"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="66"
        x2="80"
        y2="66"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Checkmark badge */}
      <circle cx="106" cy="68" r="12" fill="#10B981" />
      <path
        d="M102 68 L105 71 L110 65"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const MagnifierIllustration = (
    <svg
      viewBox="0 0 160 100"
      className="w-28 h-20 drop-shadow-xs"
      fill="none"
      role="img"
      aria-label="Ilustrasi Makna Tersirat"
    >
      <title>Ilustrasi Makna Tersirat</title>
      {/* Text block background */}
      <rect
        x="36"
        y="22"
        width="62"
        height="56"
        rx="6"
        fill="#FFFFFF"
        stroke="#6366F1"
        strokeWidth="2"
      />
      <line
        x1="44"
        y1="34"
        x2="88"
        y2="34"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="44"
        y1="44"
        x2="72"
        y2="44"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="44"
        y1="54"
        x2="84"
        y2="54"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="44"
        y1="64"
        x2="65"
        y2="64"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Magnifying Glass */}
      <circle cx="96" cy="46" r="18" fill="#EFF6FF" stroke="#0284C7" strokeWidth="3" />
      <line
        x1="88"
        y1="44"
        x2="104"
        y2="44"
        stroke="#F59E0B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="88"
        y1="50"
        x2="100"
        y2="50"
        stroke="#0284C7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Handle */}
      <path d="M109 59 L126 76" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
      <path d="M110 60 L124 74" stroke="#F7CE46" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  return (
    <DashboardGrid
      title="Materi Bahasa Indonesia"
      subtitle="Pelajari materi penting untuk mempersiapkan TKA Bahasa Indonesia."
      actionText="Lihat Semua Materi"
      actionHref={allMaterialsHref}
      onAction={onViewAllMaterials}
      isLoading={isLoading}
      className={className}
    >
      {(materials ?? []).map((material, index) => (
        <MaterialCard
          key={material.id}
          title={material.title}
          description={material.description}
          illustration={[BookIllustration, DocumentIllustration, MagnifierIllustration][index % 3]}
          actionText="Pelajari Materi"
          href="/student/learning"
          onLearn={() => onLearnMaterial?.(material.id)}
        />
      ))}
    </DashboardGrid>
  );
}
