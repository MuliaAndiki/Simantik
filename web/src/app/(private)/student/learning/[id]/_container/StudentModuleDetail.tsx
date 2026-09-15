'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import type { ModuleMaterialSummaryItem } from '@/components/organisms/student/ModuleMaterialsListGrid';
import { StudentModuleDetailPage } from '@/components/page/private/student/StudentModuleDetailPage';
import { useApi } from '@/hooks/useApi';

interface StudentModuleDetailContainerProps {
  moduleId?: string;
}

export default function StudentModuleDetailContainer({
  moduleId: propModuleId,
}: StudentModuleDetailContainerProps) {
  const router = useRouter();
  const params = useParams();
  const moduleId = propModuleId || (params?.id as string) || '';

  const { learning, question } = useApi();

  // 1. Get module by ID: mod.Get("/:id", lh.GetModule)
  const {
    data: moduleDetail,
    isLoading: isModuleLoading,
    error: moduleError,
    refetch,
  } = learning.query.moduleDetail(moduleId, { enabled: !!moduleId });

  // 2. Get list of materials for this module: mat.Get("/", lh.ListMaterials)
  const { data: materialsPage, isLoading: isMaterialsLoading } = learning.query.materials(
    { module_id: moduleId, limit: 100 },
    { enabled: !!moduleId }
  );

  // 3. Competencies for metadata mapping
  const { data: competenciesPage } = question.query.competencies({ limit: 50 });

  const competencyMap = useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();
    for (const competency of competenciesPage?.competencies ?? []) {
      map.set(competency.id, { code: competency.code, name: competency.name });
    }
    return map;
  }, [competenciesPage]);

  // Combine materials from materials list endpoint or module detail embedded materials
  const materialsList: ModuleMaterialSummaryItem[] = useMemo(() => {
    if (materialsPage?.materials && materialsPage.materials.length > 0) {
      return materialsPage.materials.map((m) => {
        const comp = m.competency_id ? competencyMap.get(m.competency_id) : undefined;
        return {
          id: m.id,
          title: m.title,
          description: m.description,
          type: m.type,
          competencyCode: comp?.code || m.competency_id || undefined,
          competencyName: comp?.name || m.competency_name || undefined,
          isCompleted: m.is_completed,
          href: `/student/learning/${moduleId}/material/${m.id}`,
        };
      });
    }

    if (moduleDetail?.materials && moduleDetail.materials.length > 0) {
      return moduleDetail.materials.map((m) => {
        const comp = m.competency_id ? competencyMap.get(m.competency_id) : undefined;
        return {
          id: m.id,
          title: m.title,
          type: m.type,
          competencyCode: comp?.code || m.competency_id || undefined,
          competencyName: comp?.name || undefined,
          isCompleted: m.is_completed,
          href: `/student/learning/${moduleId}/material/${m.id}`,
        };
      });
    }

    return [];
  }, [materialsPage, moduleDetail, competencyMap, moduleId]);

  const handleBackToModules = () => {
    router.push('/student/learning');
  };

  const handleSelectMaterial = (materialId: string) => {
    router.push(`/student/learning/${moduleId}/material/${materialId}`);
  };

  return (
    <StudentModuleDetailPage
      isLoading={isModuleLoading && !moduleDetail}
      error={moduleError ? (moduleError as Error) : null}
      onRetry={() => refetch()}
      onBackToList={handleBackToModules}
      breadcrumbProps={{
        title: moduleDetail?.title || 'Detail Modul',
        onBack: handleBackToModules,
        backHref: '/student/learning',
      }}
      heroProps={{
        title: moduleDetail?.title || 'Modul Pembelajaran',
        description:
          moduleDetail?.description ||
          'Pelajari seluruh materi yang disiapkan dalam modul pembelajaran ini secara terstruktur.',
        materialsCount: moduleDetail?.materials_count ?? materialsList.length,
        completedCount: moduleDetail?.completed_count ?? 0,
        progressPercentage: moduleDetail?.progress_percentage ?? 0,
        illustrationSrc: '/illustrations/student-learning.jpg',
      }}
      materialsProps={{
        materials: materialsList,
        onSelectMaterial: handleSelectMaterial,
      }}
    />
  );
}
