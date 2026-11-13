'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TestimonialSubmitModal } from '@/components/organisms/public/testimonials/TestimonialSubmitModal';
import { queryKey } from '@/configs/query-key';
import { useApi } from '@/hooks/useApi';
import {
  readTestimonialSnooze,
  saveTestimonialSnooze,
  shouldShowTestimonialPrompt,
} from '@/utils/testimonial-prompt.util';

const PROMPT_DELAY_MS = 1500;

export default function StudentTestimonialPrompt() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, content } = useApi();

  const meQuery = user.query.me();
  const isStudent = meQuery.data?.role?.toLowerCase() === 'student';
  const userId = meQuery.data?.id;

  const statusQuery = content.query.myTestimonialStatus({
    enabled: Boolean(userId && isStudent),
  });
  const createTestimonial = content.mutate.createTestimonial();

  const [isOpen, setIsOpen] = useState(false);
  const [snoozeVersion, setSnoozeVersion] = useState(0);
  const submittedRef = useRef(false);

  const defaultAuthorRole = useMemo(() => {
    const school = meQuery.data?.studentProfile?.school?.trim();
    const grade = meQuery.data?.studentProfile?.grade?.trim();
    if (school && grade) return `Siswa ${school} • ${grade}`;
    if (school) return `Siswa ${school}`;
    if (grade) return `Siswa • ${grade}`;
    return 'Siswa SIMANTIK';
  }, [meQuery.data]);

  useEffect(() => {
    void snoozeVersion;

    if (!userId || !isStudent || submittedRef.current) {
      setIsOpen(false);
      return;
    }

    const snoozeUntil = readTestimonialSnooze(userId);
    const eligible = shouldShowTestimonialPrompt({
      status: statusQuery.data,
      snoozeUntil,
      pathname,
    });

    if (!eligible) {
      setIsOpen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, PROMPT_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isStudent, pathname, snoozeVersion, statusQuery.data, userId]);

  const handleClose = () => {
    setIsOpen(false);
    if (!submittedRef.current && userId) {
      saveTestimonialSnooze(userId);
      setSnoozeVersion((prev) => prev + 1);
    }
  };

  const handleSubmit = async (data: {
    authorName: string;
    authorRole: string;
    content: string;
    rating: number;
  }) => {
    try {
      await createTestimonial.mutateAsync(data);
      submittedRef.current = true;
    } catch (err: unknown) {
      const status =
        (err as { response?: { status?: number }; status?: number })?.response?.status ??
        (err as { status?: number })?.status;
      if (status === 409) {
        submittedRef.current = true;
        setIsOpen(false);
        await queryClient.invalidateQueries({ queryKey: queryKey.content.myTestimonialStatus() });
        return;
      }
      throw err;
    }
  };

  if (!isStudent) {
    return null;
  }

  return (
    <TestimonialSubmitModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      isLoading={createTestimonial.isPending}
      defaultAuthorName={meQuery.data?.fullName ?? ''}
      defaultAuthorRole={defaultAuthorRole}
      closeLabel="Nanti saja"
    />
  );
}
