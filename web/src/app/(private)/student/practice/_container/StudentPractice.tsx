'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { PracticePackageItem } from '@/components/molecules/student/PracticePackageCard';
import { StudentPracticePage } from '@/components/page/private/student/StudentPracticePage';
import { useApi } from '@/hooks/useApi';
import type { PaginatedEvaluationsResponse, PracticePackageResponse } from '@/types/service';

const COMPETENCIES_LIMIT = 100;
const PRACTICE_EVALUATIONS_LIMIT = 100;

type Competency = { id: string; code: string; name: string; description: string };

type PracticeResult = {
  totalQuestions: number;
  score: number;
};

type PracticeResultMap = Map<string, PracticeResult>;

/**
 * Fallback mapping if backend practice packages are empty or in migration.
 */
function buildPracticeResultMap(
  evaluationsPage: PaginatedEvaluationsResponse | null | undefined
): PracticeResultMap {
  const map: PracticeResultMap = new Map();

  for (const evaluation of evaluationsPage?.evaluations ?? []) {
    for (const comp of evaluation.competency_evaluations ?? []) {
      if (!map.has(comp.competency_id)) {
        map.set(comp.competency_id, {
          totalQuestions: comp.total_questions,
          score: Math.round(comp.score),
        });
      }
    }
  }

  return map;
}

function toPracticePackagesFromCompetencies(
  competencies: Competency[] | undefined,
  results: PracticeResultMap
): PracticePackageItem[] {
  return (competencies ?? []).map((competency) => {
    const result = results.get(competency.id);
    const isCompleted = result !== undefined;

    return {
      id: competency.id,
      title: competency.name,
      description: competency.description,
      competencyCode: competency.code,
      competencyName: competency.name,
      status: isCompleted ? 'sudah-dikerjakan' : 'belum-dikerjakan',
      totalQuestions: result?.totalQuestions ?? 0,
      score: result?.score,
    };
  });
}

/**
 * Maps real backend practice packages from GET /api/v1/practices (practice_routes.go).
 */
function mapBackendPackages(
  packages: PracticePackageResponse[] | undefined
): PracticePackageItem[] {
  return (packages ?? []).map((pkg) => {
    const isCompleted = pkg.is_completed ?? false;
    return {
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      competencyCode: pkg.competency_code || 'pemahaman-tekstual',
      competencyName: pkg.competency_name || 'Kompetensi Umum',
      status: isCompleted ? 'sudah-dikerjakan' : 'belum-dikerjakan',
      totalQuestions: pkg.total_questions ?? 0,
      score:
        pkg.latest_score !== undefined && pkg.latest_score !== null
          ? Math.round(pkg.latest_score)
          : undefined,
    };
  });
}

export default function StudentPractice() {
  const router = useRouter();
  const { evaluation, practice, question } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // 1. Fetch practice packages directly from GET /api/v1/practices
  const { data: practicePage, isLoading: isPracticeLoading } = practice.query.list({
    limit: 100,
  });

  // 2. Fetch competencies for filters and fallback
  const { data: competenciesPage } = question.query.competencies({
    limit: COMPETENCIES_LIMIT,
  });

  // 3. Fallback evaluation query in case no practice packages are created yet
  const { data: evaluationsPage } = evaluation.query.list({
    source_type: 'practice',
    limit: PRACTICE_EVALUATIONS_LIMIT,
  });

  const practiceResults = useMemo(() => buildPracticeResultMap(evaluationsPage), [evaluationsPage]);

  // Use backend packages if available, otherwise graceful fallback
  const packages = useMemo(() => {
    if (practicePage?.packages && practicePage.packages.length > 0) {
      return mapBackendPackages(practicePage.packages);
    }
    return toPracticePackagesFromCompetencies(competenciesPage?.competencies, practiceResults);
  }, [practicePage?.packages, competenciesPage?.competencies, practiceResults]);

  const competencyOptions = useMemo(() => {
    const list = competenciesPage?.competencies ?? [];
    if (list.length > 0) {
      return [
        { value: 'all', label: 'Semua Kompetensi' },
        ...list.map((competency) => ({
          value: competency.code,
          label: competency.name,
        })),
      ];
    }

    // Extract unique competencies from packages if list is empty
    const uniqueCompetencies = new Map<string, string>();
    for (const pkg of packages) {
      if (pkg.competencyCode && !uniqueCompetencies.has(pkg.competencyCode)) {
        uniqueCompetencies.set(pkg.competencyCode, pkg.competencyName);
      }
    }

    return [
      { value: 'all', label: 'Semua Kompetensi' },
      ...Array.from(uniqueCompetencies.entries()).map(([code, name]) => ({
        value: code,
        label: name,
      })),
    ];
  }, [competenciesPage, packages]);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesCompetency =
        selectedCompetency === 'all' || pkg.competencyCode === selectedCompetency;

      const matchesStatus = selectedStatus === 'all' || pkg.status === selectedStatus;

      const trimmedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        trimmedQuery === '' ||
        pkg.title.toLowerCase().includes(trimmedQuery) ||
        pkg.description.toLowerCase().includes(trimmedQuery) ||
        pkg.competencyName.toLowerCase().includes(trimmedQuery);

      return matchesCompetency && matchesStatus && matchesSearch;
    });
  }, [packages, searchQuery, selectedCompetency, selectedStatus]);

  const isFiltered =
    searchQuery.trim() !== '' || selectedCompetency !== 'all' || selectedStatus !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCompetency('all');
    setSelectedStatus('all');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCompetencyChange = (competency: string) => {
    setSelectedCompetency(competency);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleStartPractice = (packageId: string) => {
    router.push(`/student/practice/${packageId}`);
  };

  const handleViewResult = (packageId: string) => {
    router.push(`/student/practice/${packageId}/result`);
  };

  const handleRetryPractice = (packageId: string) => {
    router.push(`/student/practice/${packageId}`);
  };

  return (
    <StudentPracticePage
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      selectedCompetency={selectedCompetency}
      onCompetencyChange={handleCompetencyChange}
      selectedStatus={selectedStatus}
      onStatusChange={handleStatusChange}
      competencyOptions={competencyOptions}
      packages={filteredPackages}
      totalAllPackages={packages.length}
      onStartPractice={handleStartPractice}
      onViewResult={handleViewResult}
      onRetryPractice={handleRetryPractice}
      onResetFilters={handleResetFilters}
      isFiltered={isFiltered}
    />
  );
}
