import { EyeOff, FileQuestion, Pencil, Trash2, UploadCloud } from 'lucide-react';

export interface PackageTableActionsProps<T> {
  item: T;
  isPublished: boolean;
  onEdit: (item: T) => void;
  onManageQuestions?: (item: T) => void;
  onToggleStatus: (item: T) => void;
  onDelete: (item: T) => void;
  labels: {
    manage: string;
    edit: string;
    publish: string;
    unpublish: string;
    delete: string;
  };
}

// Blok 4 tombol aksi tabel paket (practice & tryouts):
// Kelola Soal, Edit, Publish/Unpublish, Hapus.
export function PackageTableActions<T>({
  item,
  isPublished,
  onEdit,
  onManageQuestions,
  onToggleStatus,
  onDelete,
  labels,
}: PackageTableActionsProps<T>) {
  return (
    <div className="inline-flex items-center justify-center gap-1.5">
      {onManageQuestions && (
        <button
          type="button"
          onClick={() => onManageQuestions(item)}
          className="p-1.5 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-lg transition cursor-pointer"
          title={labels.manage}
        >
          <FileQuestion className="w-4 h-4" />
        </button>
      )}

      <button
        type="button"
        onClick={() => onEdit(item)}
        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        title={labels.edit}
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onToggleStatus(item)}
        className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition cursor-pointer"
        title={isPublished ? labels.unpublish : labels.publish}
      >
        {isPublished ? <EyeOff className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
      </button>

      <button
        type="button"
        onClick={() => onDelete(item)}
        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
        title={labels.delete}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
