import {
  BarChart2,
  EyeOff,
  FileQuestion,
  MoreVertical,
  Pencil,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';

export interface PackageTableActionsProps<T> {
  item: T;
  isPublished: boolean;
  onEdit: (item: T) => void;
  onManageQuestions?: (item: T) => void;
  onViewResults?: (item: T) => void;
  onToggleStatus: (item: T) => void;
  onDelete: (item: T) => void;
  labels: {
    manage: string;
    edit: string;
    publish: string;
    unpublish: string;
    delete: string;
    results?: string;
  };
}

// 3-dots dropdown menu aksi tabel paket (practice & tryouts)
export function PackageTableActions<T>({
  item,
  isPublished,
  onEdit,
  onManageQuestions,
  onViewResults,
  onToggleStatus,
  onDelete,
  labels,
}: PackageTableActionsProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer inline-flex items-center justify-center"
          title="Menu Aksi"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white shadow-lg border border-slate-200/80 rounded-xl p-1 z-50"
      >
        {onViewResults && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onViewResults(item);
            }}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-cyan-800 hover:bg-cyan-50/70 rounded-lg cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-cyan-700" />
            <span>{labels.results || 'Detail & Hasil Siswa'}</span>
          </DropdownMenuItem>
        )}

        {onManageQuestions && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onManageQuestions(item);
            }}
            className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-cyan-800 hover:bg-cyan-50/70 rounded-lg cursor-pointer"
          >
            <FileQuestion className="w-4 h-4 text-cyan-700" />
            <span>{labels.manage}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 rounded-lg cursor-pointer"
        >
          <Pencil className="w-4 h-4 text-amber-500" />
          <span>{labels.edit}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(item);
          }}
          className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          {isPublished ? (
            <>
              <EyeOff className="w-4 h-4 text-slate-500" />
              <span>{labels.unpublish}</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>{labels.publish}</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-slate-100" />

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>{labels.delete}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
