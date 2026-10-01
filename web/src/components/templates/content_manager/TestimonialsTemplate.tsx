import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  TestimonialsFilterBar,
  TestimonialsSummaryCards,
  TestimonialsTable,
} from '@/components/organisms/content_manager/testimonials';
import type { TestimonialResponse } from '@/types/service';
import type { TestimonialsStats } from '@/types/ui/content-manager';

export interface TestimonialsFilterState {
  status: string;
  page: number;
  perPage: number;
}

export interface TestimonialsTemplateProps {
  stats: TestimonialsStats;
  testimonials: TestimonialResponse[];
  filters: TestimonialsFilterState;
  totalItems: number;
  isPending: boolean;
  onStatusChange: (val: string) => void;
  onApprove: (item: TestimonialResponse) => void;
  onReject: (item: TestimonialResponse) => void;
  onDelete: (item: TestimonialResponse) => void;
  onPageChange: (page: number) => void;
}

const TestimonialsTemplate: React.FC<TestimonialsTemplateProps> = ({
  stats,
  testimonials,
  filters,
  totalItems,
  isPending,
  onStatusChange,
  onApprove,
  onReject,
  onDelete,
  onPageChange,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Testimoni</h1>
          <p className="text-sm text-slate-500 mt-1">
            Moderasi testimoni siswa: setujui, tolak, atau hapus testimoni yang masuk.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <TestimonialsSummaryCards stats={stats} />

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        <TestimonialsFilterBar status={filters.status} onStatusChange={onStatusChange} />

        {isPending ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <TableLoader label="Memuat data testimoni..." />
          </div>
        ) : (
          <TestimonialsTable
            testimonials={testimonials}
            currentPage={filters.page}
            totalItems={totalItems}
            rowsPerPage={filters.perPage}
            onPageChange={onPageChange}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default TestimonialsTemplate;
