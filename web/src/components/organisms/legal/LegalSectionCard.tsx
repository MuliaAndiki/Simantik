import { Check, CheckCircle, Globe, Mail } from 'lucide-react';
import type * as React from 'react';
import type { LegalSection } from '@/data/legal-docs.data';
import { cn } from '@/utils/classname';

export interface LegalSectionCardProps {
  section: LegalSection;
  className?: string;
}

export function LegalSectionCard({ section, className }: LegalSectionCardProps) {
  return (
    <article
      id={section.id}
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-5',
        className
      )}
    >
      {/* Header with Number Badge & Title */}
      <div className="flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-100/80 text-teal-800 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
          {section.number}
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
          {parseInt(section.number, 10)}. {section.title}
        </h2>
      </div>

      {/* Lead Text */}
      {section.lead && (
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{section.lead}</p>
      )}

      {/* Subsections */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="space-y-4 pt-1">
          {section.subsections.map((sub, idx) => (
            <div
              key={sub.id || idx}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-3"
            >
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">{sub.title}</h3>
              {sub.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {sub.description}
                </p>
              )}
              {sub.points && sub.points.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 pt-1">
                  {sub.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sub.note && (
                <p className="text-xs text-slate-500 pt-1 leading-relaxed border-t border-slate-200/50">
                  {sub.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Direct Points (Formatted as numbered list or bullet list) */}
      {section.points && section.points.length > 0 && (
        <div className="space-y-2 pt-1">
          {section.points.map((pt, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Roles Cards (STUDENT, ADMIN, CONTENT MANAGER) */}
      {section.roles && section.roles.length > 0 && (
        <div className="space-y-4 pt-1">
          {section.roles.map((roleItem, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-2.5"
            >
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-teal-100/70 text-teal-800 text-xs font-bold uppercase tracking-wider">
                {roleItem.role}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {roleItem.description}
              </p>
              {roleItem.attributes && roleItem.attributes.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 pt-1">
                  {roleItem.attributes.map((attr, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                      <span>{attr}</span>
                    </li>
                  ))}
                </ul>
              )}
              {roleItem.note && (
                <p className="text-xs text-slate-500 pt-1 leading-relaxed border-t border-slate-200/50">
                  {roleItem.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Public Tags Badges */}
      {section.tags && section.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {section.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-slate-100 text-slate-700 text-xs px-3.5 py-1 font-medium border border-slate-200/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Checklist (User Responsibilities) */}
      {section.checks && section.checks.length > 0 && (
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 sm:p-5 space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            Pengguna juga memiliki tanggung jawab untuk:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            {section.checks.map((chk, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{chk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact Box */}
      {section.contactBox && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#133E4D] text-amber-400 font-extrabold flex items-center justify-center text-base">
              S
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                {section.contactBox.title}
              </h3>
              {section.contactBox.subtitle && (
                <p className="text-xs text-slate-500">{section.contactBox.subtitle}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {section.contactBox.email && (
              <a
                href={`mailto:${section.contactBox.email}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50/50 hover:border-teal-200 transition-all group"
              >
                <div className="p-2 rounded-lg bg-white shadow-2xs text-teal-700 group-hover:bg-teal-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Email Resmi
                  </span>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-teal-800 truncate block">
                    {section.contactBox.email}
                  </span>
                </div>
              </a>
            )}

            {section.contactBox.website && (
              <a
                href={section.contactBox.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50/50 hover:border-teal-200 transition-all group"
              >
                <div className="p-2 rounded-lg bg-white shadow-2xs text-teal-700 group-hover:bg-teal-100">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Website Resmi
                  </span>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-teal-800 truncate block">
                    {section.contactBox.website}
                  </span>
                </div>
              </a>
            )}
          </div>

          {section.contactBox.note && (
            <p className="text-xs text-slate-500 italic leading-relaxed pt-1">
              {section.contactBox.note}
            </p>
          )}
        </div>
      )}

      {/* Agreement Box (Yellow / Amber Styled Card) */}
      {section.agreementBox && (
        <div className="rounded-2xl border-2 border-amber-300/80 bg-amber-50/30 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm sm:text-base">
            <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{section.agreementBox.title}</span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {section.agreementBox.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {section.agreementBox.warning && (
            <div className="rounded-xl border border-teal-200/80 bg-white p-3.5 text-xs text-teal-900 leading-relaxed font-medium">
              {section.agreementBox.warning}
            </div>
          )}
        </div>
      )}

      {/* Custom Note (Multi-paragraph capable) */}
      {section.customNote && (
        <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {section.customNote.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      )}
    </article>
  );
}
