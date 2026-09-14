import type * as React from 'react';
import type { NewsItem } from '@/components/organisms/student/LatestUpdatesGrid';
import type { DashboardMaterialItem } from '@/components/organisms/student/LearningMaterialsGrid';
import { StudentDashboardTemplate } from '@/components/templates/student/StudentDashboardTemplate';

export interface DashboardStudentPageProps {
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
  studentName = 'Anindya',
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
        onViewHistory,
      }}
      materialsProps={{
        materials,
        onLearnMaterial,
        onViewAllMaterials,
      }}
      recommendationProps={{
        topicTitle: recommendationTopicTitle,
        recommendationDescription,
        onStartPractice,
      }}
      updatesProps={{
        newsList,
        onReadNews,
      }}
    />
  );
}

export default DashboardStudentPage;
