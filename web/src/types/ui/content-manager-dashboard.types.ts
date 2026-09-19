export interface ContentManagerKpiStats {
  totalMateri: number;
  materiSubtitle?: string;
  paketBankSoal: number;
  bankSoalSubtitle?: string;
  totalPaketTryout: number;
  tryoutSubtitle?: string;
  kontenPublik: number;
  kontenPublikSubtitle?: string;
}

export interface TryoutWorkflowAutomation {
  modulUjian: string;
  kumpulanSoalTotal: number;
  alokasiSiswa: number;
  durasiMenit: number;
  statusDistribusi: 'Published' | 'Draft' | 'Archived';
}

export interface PipelineMateriData {
  total: number;
  siapDigunakanPercentage: number;
  draftCount: number;
  publishedCount: number;
  archivedCount: number;
}

export interface DistribusiBankSoalData {
  total: number;
  aktifPercentage: number;
  draftCount: number;
  publishedCount: number;
  unpublishedCount: number;
}

export interface ManagedTryoutItem {
  id: string;
  title: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  totalSoalTersedia: number;
  soalPerSiswa: number;
  durasiMenit: number;
  diperbaruiTanggal: string;
}

export interface CuratorActivityItem {
  id: string;
  title: string;
  timeAgo: string;
  dotColor: 'yellow' | 'blue' | 'teal' | 'navy';
}

export interface ContentManagerDashboardData {
  kpiStats: ContentManagerKpiStats;
  tryoutWorkflow: TryoutWorkflowAutomation;
  materiPipeline: PipelineMateriData;
  bankSoalDistribusi: DistribusiBankSoalData;
  managedTryouts: ManagedTryoutItem[];
  curatorActivities: CuratorActivityItem[];
}
