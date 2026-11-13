import type * as React from 'react';
import StudentTestimonialPrompt from './_container/StudentTestimonialPrompt';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StudentTestimonialPrompt />
    </>
  );
}
