import type React from 'react';
import { getLanguageName, type Language } from '@/configs/i18n.config';
import { cn } from '@/utils/classname';

export interface PreferenceToggle {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

export interface PreferencePanelProps {
  title: string;
  description: string;
  toggles: PreferenceToggle[];
  onToggle: (id: string, checked: boolean) => void;
  languageTitle?: string;
  languageDescription?: string;
  languages?: Language[];
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

/** Panel preferensi: daftar toggle + pemilih bahasa (tersimpan lokal di browser). */
export const PreferencePanel: React.FC<PreferencePanelProps> = ({
  title,
  description,
  toggles,
  onToggle,
  languageTitle = 'Bahasa Antarmuka',
  languageDescription = 'Pilih bahasa yang digunakan pada aplikasi.',
  languages = [],
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
      </div>

      <div className="space-y-3 max-w-xl">
        {toggles.map((toggle) => (
          <button
            key={toggle.id}
            type="button"
            role="switch"
            aria-checked={toggle.checked}
            onClick={() => onToggle(toggle.id, !toggle.checked)}
            className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer text-left"
          >
            <span>
              <span className="block text-xs font-bold text-slate-800">{toggle.label}</span>
              <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
                {toggle.description}
              </span>
            </span>
            <span
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                toggle.checked ? 'bg-teal-600' : 'bg-slate-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
                  toggle.checked ? 'left-[22px]' : 'left-0.5'
                )}
              />
            </span>
          </button>
        ))}
      </div>

      {languages.length > 0 && onLanguageChange && (
        <div className="max-w-xl">
          <h3 className="text-xs font-bold text-slate-700">{languageTitle}</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 mb-3">
            {languageDescription}
          </p>
          <div className="flex items-center gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer',
                  currentLanguage === lang
                    ? 'bg-[#EAF6F8] text-teal-800 border-cyan-200'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                )}
              >
                {getLanguageName(lang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencePanel;
