import NewsCreateDialog from "@/components/organisms/content_manager/news/NewsCreateDialog";
import { TMode } from "@/types/app";
import { CreateNewsRequest } from "@/types/service";
import { Newspaper } from "lucide-react";
import { Plus } from "lucide-react";

export interface NewsTemplateProps {
  onOpenDialogChange: (open: boolean) => void;
  open: boolean;
  form: CreateNewsRequest;
  mode: TMode;
  onNewsFormChange: (field: keyof CreateNewsRequest, value: string) => void;
  setMode: React.Dispatch<React.SetStateAction<TMode>>;
  handleSubmit: () => Promise<void> | void;
}
const NewsTemplate: React.FC<NewsTemplateProps> = ({
  onOpenDialogChange,
  form,
  open,
  mode,
  setMode,
  onNewsFormChange,
  handleSubmit,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex  items-start flex-col ">
          <div className="flex items-center gap-1">
            <Newspaper className="size-5 text-primary" />
            <h1 className="text-2xl font-semibold">Manajemen Berita</h1>
          </div>
          <span className="text-base text-gray-700">
            Kelola Konten Berita Disini
          </span>
        </div>
        <div className="">
          <button
            type="button"
            onClick={() => onOpenDialogChange(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#134653] hover:bg-[#0B2D38] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah News Baru</span>
          </button>
        </div>
      </div>
      <NewsCreateDialog
        open={open}
        handleSubmit={handleSubmit}
        onOpenChange={onOpenDialogChange}
        form={form}
        onChange={onNewsFormChange}
        mode={mode}
      />
    </div>
  );
};

export default NewsTemplate;
