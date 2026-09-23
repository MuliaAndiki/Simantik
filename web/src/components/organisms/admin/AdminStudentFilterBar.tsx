import { RefreshCw, Search } from 'lucide-react';
import React from 'react';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface AdminStudentFilterBarProps {
  search: string;
  statusFilter: string;
  isRefreshing?: boolean;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  className?: string;
}

export const AdminStudentFilterBar: React.FC<AdminStudentFilterBarProps> = ({
  search,
  statusFilter,
  isRefreshing = false,
  onSearchChange,
  onStatusChange,
  onRefresh,
  className,
}) => {
  return (
    <div className={cn('flex flex-col md:flex-row items-center gap-3', className)}>
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari berdasarkan Nama Siswa atau Email..."
          className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
        />
      </div>

      <div className="flex items-center gap-2.5 w-full md:w-auto">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold">
            <SelectValue placeholder="Status Akun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="suspended">Ditangguhkan</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-10 px-3.5 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default AdminStudentFilterBar;
