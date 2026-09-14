'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { LearningMaterialItem } from '@/components/molecules/student/LearningMaterialItemCard';
import { StudentLearningPage } from '@/components/page/private/student/StudentLearningPage';
import { useApi } from '@/hooks/useApi';
import type { PaginatedMaterialsResponse } from '@/types/service';

const MATERIALS_LIMIT = 100;
const COMPETENCIES_LIMIT = 50;

type CompetencyMap = Map<string, { code: string; name: string }>;

function buildCompetencyMap(
  competencies: Array<{ id: string; code: string; name: string }> | undefined
): CompetencyMap {
  const map: CompetencyMap = new Map();
  for (const competency of competencies ?? []) {
    map.set(competency.id, { code: competency.code, name: competency.name });
  }
  return map;
}

function toLearningMaterials(
  materialsPage: PaginatedMaterialsResponse | null | undefined,
  competencyMap: CompetencyMap
): LearningMaterialItem[] {
  return (materialsPage?.materials ?? []).map((material) => {
    const competency = material.competency_id
      ? competencyMap.get(material.competency_id)
      : undefined;
    return {
      id: material.id,
      title: material.title,
      description: material.description,
      competencyCode: competency?.code ?? material.competency_id ?? '',
      competencyName: competency?.name ?? material.competency_name ?? '',
    };
  });
}

export default function StudentLearningContainer() {
  const router = useRouter();
  const { learning, question } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('all');

  const { data: materialsPage } = learning.query.materials({ limit: MATERIALS_LIMIT });
  const { data: competenciesPage } = question.query.competencies({ limit: COMPETENCIES_LIMIT });

  const competencyMap = useMemo(
    () => buildCompetencyMap(competenciesPage?.competencies),
    [competenciesPage]
  );

  const materials = useMemo(
    () => toLearningMaterials(materialsPage, competencyMap),
    [materialsPage, competencyMap]
  );

  const competencyOptions = useMemo(() => {
    return [
      { value: 'all', label: 'Semua Kompetensi' },
      ...(competenciesPage?.competencies ?? []).map((competency) => ({
        value: competency.code,
        label: competency.name,
      })),
    ];
  }, [competenciesPage]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesCompetency =
        selectedCompetency === 'all' || material.competencyCode === selectedCompetency;

      const trimmedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        trimmedQuery === '' ||
        material.title.toLowerCase().includes(trimmedQuery) ||
        material.description.toLowerCase().includes(trimmedQuery) ||
        material.competencyName.toLowerCase().includes(trimmedQuery);

      return matchesCompetency && matchesSearch;
    });
  }, [materials, searchQuery, selectedCompetency]);

  const isFiltered = searchQuery.trim() !== '' || selectedCompetency !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCompetency('all');
  };

  const handleLearnMaterial = (materialId: string) => {
    router.push(`/student/learning/${materialId}`);
  };

  return (
    <StudentLearningPage
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCompetency={selectedCompetency}
      onCompetencyChange={setSelectedCompetency}
      competencyOptions={competencyOptions}
      materials={filteredMaterials}
      onLearnMaterial={handleLearnMaterial}
      onResetFilters={handleResetFilters}
      isFiltered={isFiltered}
    />
  );
}
