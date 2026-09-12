'use client';

import { useState } from 'react';
import type { z } from 'zod';

type FormErrors<T> = Partial<Record<keyof T, string>>;

export function useAuthForm<T extends z.ZodType>(schema: T, initial: z.infer<T>) {
  type Values = z.infer<T>;

  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<FormErrors<Values>>({});

  const onChange = (field: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): Values | null => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const mapped: FormErrors<Values> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!mapped[key]) mapped[key] = issue.message;
      }
      setErrors(mapped);
      return null;
    }
    setErrors({});
    return parsed.data;
  };

  return { values, errors, onChange, validate };
}
