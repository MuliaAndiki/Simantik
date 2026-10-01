'use client';

import { useMemo, useState } from 'react';
import TestimonialsPage from '@/components/page/private/content_manager/TestimonialsPage';
import type { TestimonialsFilterState } from '@/components/templates/content_manager/TestimonialsTemplate';
import useApi from '@/hooks/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import type { TestimonialResponse } from '@/types/service';
import type { TestimonialsStats } from '@/types/ui/content-manager';

const INITIAL_FILTERS: TestimonialsFilterState = {
  status: 'all',
  page: 1,
  perPage: 6,
};

const TestimonialsListContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();

  const [filters, setFilters] = useState<TestimonialsFilterState>(INITIAL_FILTERS);

  const testimonialsQuery = api.content.query.cmsTestimonials({
    status: filters.status !== 'all' ? filters.status : undefined,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  const updateStatusMutation = api.content.mutate.updateTestimonialStatus();
  const deleteMutation = api.content.mutate.deleteTestimonial();

  const testimonials = testimonialsQuery.data?.testimonials ?? [];
  const totalItems = testimonialsQuery.data?.total ?? 0;

  const stats = useMemo<TestimonialsStats>(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const item of testimonials) {
      const status = item.status.toLowerCase();
      if (status === 'approved') approved++;
      else if (status === 'rejected') rejected++;
      else pending++;
    }

    return { total: totalItems, pending, approved, rejected };
  }, [testimonials, totalItems]);

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleApprove = (item: TestimonialResponse) => {
    updateStatusMutation.mutate({ id: item.id, body: { status: 'approved' } });
  };

  const handleReject = (item: TestimonialResponse) => {
    ns.alert.confirm({
      title: 'Tolak Testimoni',
      deskripsi: `Tolak testimoni dari "${item.authorName}"? Testimoni tidak akan tampil di landing page.`,
      onConfirm: () => updateStatusMutation.mutate({ id: item.id, body: { status: 'rejected' } }),
      icon: 'warning',
    });
  };

  const handleDelete = (item: TestimonialResponse) => {
    ns.alert.confirm({
      title: 'Hapus Testimoni',
      deskripsi: `Apakah anda yakin ingin menghapus testimoni dari "${item.authorName}"?`,
      onConfirm: () => deleteMutation.mutate(item.id),
      icon: 'error',
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <TestimonialsPage
      stats={stats}
      testimonials={testimonials}
      filters={filters}
      totalItems={totalItems}
      isPending={testimonialsQuery.isPending}
      onStatusChange={handleStatusChange}
      onApprove={handleApprove}
      onReject={handleReject}
      onDelete={handleDelete}
      onPageChange={handlePageChange}
    />
  );
};

export default TestimonialsListContainer;
