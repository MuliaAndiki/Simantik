'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { LearningMaterialItem } from '@/components/molecules/student/LearningMaterialItemCard';
import { StudentLearningPage } from '@/components/page/private/student/StudentLearningPage';
import { useApi } from '@/hooks/useApi';
import type { PaginatedModulesResponse } from '@/types/service';

const MODULES_LIMIT = 100;
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

function toLearningModules(
  modulesPage: PaginatedModulesResponse | null | undefined
): LearningMaterialItem[] {
  return (modulesPage?.modules ?? []).map((module) => {
    const materialsCount = module.materials_count ?? 0;
    const completedCount = module.completed_count ?? 0;
    const labelBadge =
      module.label ||
      (materialsCount > 0 ? `${completedCount}/${materialsCount} Materi Selesai` : 'Modul Belajar');

    return {
      id: module.id,
      title: module.title,
      description:
        module.description ||
        `${materialsCount} materi pembelajaran terstruktur disiapkan dalam modul ini.`,
      competencyCode: module.label || 'all',
      competencyName: labelBadge,
      href: `/student/learning/${module.id}`,
    };
  });
}

export default function StudentLearningContainer() {
  const router = useRouter();
  const { learning } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('all');

  // 1. Fetch modules: mod.Get("/", lh.ListModules) with label query support
  const { data: modulesPage } = learning.query.modules({
    limit: MODULES_LIMIT,
    label: selectedLabel !== 'all' ? selectedLabel : undefined,
  });

  // 2. Fetch distinct labels: mod.Get("/labels", lh.ListModuleLabels) for dropdown
  const { data: moduleLabels } = learning.query.moduleLabels();

  const modules = useMemo(() => toLearningModules(modulesPage), [modulesPage]);

  // Build category/label dropdown options
  const labelOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'Semua Kategori' }];
    const seen = new Set<string>();

    // From backend labels endpoint
    for (const label of moduleLabels ?? []) {
      if (label && !seen.has(label)) {
        seen.add(label);
        options.push({ value: label, label });
      }
    }

    // From loaded modules if any
    for (const mod of modulesPage?.modules ?? []) {
      if (mod.label && !seen.has(mod.label)) {
        seen.add(mod.label);
        options.push({ value: mod.label, label: mod.label });
      }
    }

    return options;
  }, [moduleLabels, modulesPage]);

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesLabel = selectedLabel === 'all' || module.competencyCode === selectedLabel;

      const trimmedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        trimmedQuery === '' ||
        module.title.toLowerCase().includes(trimmedQuery) ||
        module.description.toLowerCase().includes(trimmedQuery);

      return matchesLabel && matchesSearch;
    });
  }, [modules, searchQuery, selectedLabel]);

  const isFiltered = searchQuery.trim() !== '' || selectedLabel !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLabel('all');
  };

  const handleLearnModule = (moduleId: string) => {
    router.push(`/student/learning/${moduleId}`);
  };

  return (
    <StudentLearningPage
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCompetency={selectedLabel}
      onCompetencyChange={setSelectedLabel}
      competencyOptions={labelOptions}
      materials={filteredModules}
      onLearnMaterial={handleLearnModule}
      onResetFilters={handleResetFilters}
      isFiltered={isFiltered}
    />
  );
}
