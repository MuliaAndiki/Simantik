import React from 'react';
import { ManagerFilterBar } from '@/components/molecules/filter';
import { TESTIMONIAL_STATUS_FILTER_OPTIONS } from '@/types/ui/content-manager';

interface TestimonialsFilterBarProps {
  status: string;
  onStatusChange: (val: string) => void;
}

export const TestimonialsFilterBar: React.FC<TestimonialsFilterBarProps> = ({
  status,
  onStatusChange,
}) => {
  return (
    <ManagerFilterBar
      search=""
      searchPlaceholder=""
      onSearchChange={() => {}}
      searchWrapClassName="hidden"
      selects={[
        {
          value: status,
          options: TESTIMONIAL_STATUS_FILTER_OPTIONS,
          minWidthClass: 'min-w-[170px]',
          onChange: onStatusChange,
        },
      ]}
    />
  );
};
