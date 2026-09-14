'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { PracticePackageItem } from '@/components/molecules/student/PracticePackageCard';
import { StudentPracticePage } from '@/components/page/private/student/StudentPracticePage';
import { useApi } from '@/hooks/useApi';
import type { PaginatedEvaluationsResponse } from '@/types/service';

const COMPETENCIES_LIMIT = 100;
const PRACTICE_EVALUATIONS_LIMIT = 100;

type Competency = { id: string; code: string; name: string; description: string };

type PracticeResult = {
  totalQuestions: number;
  score: number;
};

type PracticeResultMap = Map<string, PracticeResult>;

/**
 * Backend belum punya entitas "paket latihan". Latihan dipetakan dari
 * kompetensi (satu kompetensi = satu paket latihan) + riwayat evaluasi
 * `source_type: practice` untuk status "sudah dikerjakan" dan nilainya.
 */
function buildPracticeResultMap(
  evaluationsPage: PaginatedEvaluationsResponse | null | undefined
): PracticeResultMap {
  const map: PracticeResultMap = new Map();

  // Evaluations diurutkan created_at DESC, jadi yang pertama = terbaru.
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

function toPracticePackages(
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

export default function StudentPractice() {
  const router = useRouter();
  const { evaluation, question } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: competenciesPage } = question.query.competencies({ limit: COMPETENCIES_LIMIT });
  const { data: evaluationsPage } = evaluation.query.list({
    source_type: 'practice',
    limit: PRACTICE_EVALUATIONS_LIMIT,
  });

  const practiceResults = useMemo(() => buildPracticeResultMap(evaluationsPage), [evaluationsPage]);

  const packages = useMemo(
    () => toPracticePackages(competenciesPage?.competencies, practiceResults),
    [competenciesPage, practiceResults]
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

  const handleStartPractice = (packageId: string) => {
    router.push(`/student/practice/${packageId}`);
  };

  const handleViewResult = (_packageId: string) => {
    router.push('/student/evaluation');
  };

  const handleRetryPractice = (packageId: string) => {
    router.push(`/student/practice/${packageId}`);
  };

  return (
    <StudentPracticePage
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCompetency={selectedCompetency}
      onCompetencyChange={setSelectedCompetency}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
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
