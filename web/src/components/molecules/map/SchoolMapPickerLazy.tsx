'use client';

import { Loader2, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { SchoolMapPickerProps } from './SchoolMapPicker';

const DynamicSchoolMapPicker = dynamic(() => import('./SchoolMapPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] md:h-[520px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
        Memuat peta interaktif...
      </div>
      <p className="flex items-center gap-1 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5" />
        OpenStreetMap
      </p>
    </div>
  ),
});

export function SchoolMapPickerLazy(props: SchoolMapPickerProps) {
  return <DynamicSchoolMapPicker {...props} />;
}

export type { SchoolMapPickerProps };
