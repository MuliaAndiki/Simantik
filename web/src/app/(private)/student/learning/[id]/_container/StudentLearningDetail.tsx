'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import type { RelatedMaterialItem } from '@/components/organisms/student/LearningDetailRelatedMaterials';
import { StudentLearningDetailPage } from '@/components/page/private/student/StudentLearningDetailPage';
import { useApi } from '@/hooks/useApi';

interface StudentLearningDetailContainerProps {
  materialId?: string;
  moduleId?: string;
}

export default function StudentLearningDetailContainer({
  materialId: propMaterialId,
  moduleId: propModuleId,
}: StudentLearningDetailContainerProps) {
  const router = useRouter();
  const params = useParams();
  const materialId =
    propMaterialId || (params?.materialId as string) || (params?.id as string) || '';
  const moduleId = propModuleId || (params?.id as string) || '';

  const { learning, question } = useApi();

  // 1. Fetch current material detail: mat.Get("/:id", lh.GetMaterial)
  const {
    data: material,
    isLoading: isMaterialLoading,
    error: materialError,
    refetch,
  } = learning.query.materialDetail(materialId, { enabled: !!materialId });

  // 2. Fetch list of materials for "Materi Terkait" in the same module if available
  const activeModuleId = moduleId || material?.module_id;
  const { data: materialsPage } = learning.query.materials(
    activeModuleId ? { module_id: activeModuleId, limit: 6 } : { limit: 6 }
  );

  // 3. Fetch competencies to resolve competency code/name
  const { data: competenciesPage } = question.query.competencies({ limit: 50 });

  const competencyMap = useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();
    for (const competency of competenciesPage?.competencies ?? []) {
      map.set(competency.id, { code: competency.code, name: competency.name });
    }
    return map;
  }, [competenciesPage]);

  // Resolve current material's competency info
  const currentCompetency = useMemo(() => {
    if (!material?.competency_id) {
      return {
        code: 'pemahaman-tekstual',
        name: material?.competency_name || 'Pemahaman Tekstual',
      };
    }
    const found = competencyMap.get(material.competency_id);
    return {
      code: found?.code || material.competency_id,
      name: found?.name || material.competency_name || 'Pemahaman Tekstual',
    };
  }, [material, competencyMap]);

  // Prepare related materials list (excluding the active material)
  const relatedMaterials: RelatedMaterialItem[] = useMemo(() => {
    if (!materialsPage?.materials) {
      return [];
    }

    return materialsPage.materials
      .filter((item) => item.id !== materialId)
      .slice(0, 3)
      .map((item) => {
        const comp = item.competency_id ? competencyMap.get(item.competency_id) : undefined;
        const targetModuleId = activeModuleId || item.module_id;
        return {
          id: item.id,
          title: item.title,
          description:
            item.description || 'Ringkasan pengantar materi pendukung dari kurikulum sekolah.',
          competencyCode: comp?.code || item.competency_id || 'pemahaman-tekstual',
          competencyName: comp?.name || item.competency_name || 'Pemahaman Tekstual',
          href: targetModuleId
            ? `/student/learning/${targetModuleId}/material/${item.id}`
            : `/student/learning/material/${item.id}`,
        };
      });
  }, [materialsPage, materialId, competencyMap, activeModuleId]);

  // Handlers
  const handleBackToList = () => {
    if (activeModuleId) {
      router.push(`/student/learning/${activeModuleId}`);
    } else {
      router.push('/student/learning');
    }
  };

  const handleStartPractice = () => {
    router.push('/student/practice');
  };

  const handleOpenRelatedMaterial = (targetId: string) => {
    if (activeModuleId) {
      router.push(`/student/learning/${activeModuleId}/material/${targetId}`);
    } else {
      router.push(`/student/learning/material/${targetId}`);
    }
  };

  const markProgressMutation = learning.mutate.markProgress();
  useEffect(() => {
    if (materialId && material?.id) {
      const timer = setTimeout(() => {
        markProgressMutation
          .mutateAsync({ id: materialId, body: { is_completed: true } })
          .catch(() => {});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [materialId, material?.id]);

  return (
    <StudentLearningDetailPage
      isLoading={isMaterialLoading && !material}
      error={materialError ? (materialError as Error) : null}
      onRetry={() => refetch()}
      onBackToList={handleBackToList}
      breadcrumbProps={{
        title: material?.title,
        onBack: handleBackToList,
        backHref: activeModuleId ? `/student/learning/${activeModuleId}` : '/student/learning',
      }}
      heroProps={{
        title: material?.title ?? '',
        description: material?.description ?? '',
        competencyName: currentCompetency.name,
        competencyCode: currentCompetency.code,
        illustrationSrc: '/illustrations/student-learning.jpg',
      }}
      contentProps={{
        content: material?.content,
      }}
      ctaProps={{
        title: 'Sudah memahami materi ini?',
        description: 'Uji pemahamanmu melalui latihan Bahasa Indonesia yang tersedia di SIMANTIK.',
        practiceHref: '/student/practice',
        onStartPractice: handleStartPractice,
      }}
      relatedMaterialsProps={{
        materials: relatedMaterials.length > 0 ? relatedMaterials : undefined,
        viewAllHref: '/student/learning',
        onOpenMaterial: handleOpenRelatedMaterial,
      }}
    />
  );
}
