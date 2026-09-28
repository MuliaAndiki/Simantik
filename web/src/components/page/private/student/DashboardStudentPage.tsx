import type * as React from 'react';
import type { NewsItem } from '@/components/organisms/student/LatestUpdatesGrid';
import type { DashboardMaterialItem } from '@/components/organisms/student/LearningMaterialsGrid';
import { StudentDashboardTemplate } from '@/components/templates/student/StudentDashboardTemplate';

export interface DashboardStudentPageProps {
  isLoading?: boolean;
  studentName?: string;
  lastTopic?: string;
  lastPackageName?: string;
  lastScore?: number;
  averageComparisonText?: string;
  totalSessions?: number;
  averageCorrectPerSession?: number;
  achievementStatus?: string;
  achievementSubtext?: string;
  materials?: DashboardMaterialItem[];
  recommendationTopicTitle?: string;
  recommendationDescription?: string;
  newsList?: NewsItem[];
  onStartPractice?: () => void;
  onStartTryout?: () => void;
  onViewEvaluation?: () => void;
  onViewHistory?: () => void;
  onLearnMaterial?: (materialId: string) => void;
  onViewAllMaterials?: () => void;
  onReadNews?: (newsId: string) => void;
}

export function DashboardStudentPage({
  isLoading,
  studentName,
  lastTopic,
  lastPackageName,
  lastScore,
  averageComparisonText,
  totalSessions,
  averageCorrectPerSession,
  achievementStatus,
  achievementSubtext,
  materials,
  recommendationTopicTitle,
  recommendationDescription,
  newsList,
  onStartPractice,
  onStartTryout,
  onViewEvaluation,
  onViewHistory,
  onLearnMaterial,
  onViewAllMaterials,
  onReadNews,
}: DashboardStudentPageProps) {
  return (
    <StudentDashboardTemplate
      heroProps={{
        studentName,
        isLoading,
        onStartPractice,
        onStartTryout,
      }}
      quickActionsProps={{
        onStartPractice,
        onStartTryout,
        onViewEvaluation,
      }}
      performanceProps={{
        lastTopic,
        lastPackageName,
        lastScore,
        averageComparisonText,
        totalSessions,
        averageCorrectPerSession,
        achievementStatus,
        achievementSubtext,
        isLoading,
        onViewHistory,
      }}
      materialsProps={{
        materials,
        isLoading,
        onLearnMaterial,
        onViewAllMaterials,
      }}
      recommendationProps={{
        topicTitle: recommendationTopicTitle,
        recommendationDescription,
        isLoading,
        onStartPractice,
      }}
      updatesProps={{
        newsList,
        isLoading,
        onReadNews,
      }}
    />
  );
}

export default DashboardStudentPage;
