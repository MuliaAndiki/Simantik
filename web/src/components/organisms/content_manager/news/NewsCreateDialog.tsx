import {
  Dialog,
  DialogContent,
  DialogDescription,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms";
import { CreateNewsRequest } from "@/types/service";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BookOpen, Check } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/atoms";
import { ContentStatus } from "@/types/model";
import { CONTET_STATUS_OPTIONS } from "@/types/ui/content-manager";

export interface NewsCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  form: CreateNewsRequest;
  onChange: (field: keyof CreateNewsRequest, value: string) => void;
  handleSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
}
const NewsCreateDialog: React.FC<NewsCreateDialogProps> = ({
  onOpenChange,
  open,
  mode = "create",
  onChange,
  form,
  isSubmitting = false,
  handleSubmit,
}) => {
  const labelId = useId();
  const handleClose = () => {
    onOpenChange(false);
  };
  const titleId = useId();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full rounded-3xl p-6 sm:p-8 bg-white border border-gray-100 shadow-2xl gap-0">
        <div className="flex items-start justify-between">
          <div className="size-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center border border-cyan-100/60 shadow-2xs">
            <BookOpen className="size-5 text-[#0E7490] stroke-[2.2]" />
          </div>
        </div>

        <div className="mt-4 space-y-1 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {mode === "create"
              ? "Tambah Berita Baru"
              : "Edit Berita Pembelajaran"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
            {mode === "create"
              ? "Silakan isi formulir di bawah ini untuk menambahkan Berita pembelajaran baru."
              : "Perbarui informasi dan status modul pembelajaran ini."}
          </DialogDescription>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="text-left space-y-1.5"
        >
          <div className="text-left">
            <label
              htmlFor={titleId}
              className="text-xs sm:text-sm font-semibold text-gray-700"
            >
              Judul News
            </label>
            <Input
              value={form.title}
              type="text"
              placeholder="Contoh: Publikasi"
              onChange={(e) => onChange("title", e.target.value)}
              className="h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-cyan-500/30"
              required
            />
          </div>
          <div className=" text-left">
            <label
              htmlFor={titleId}
              className="text-xs sm:text-sm font-semibold text-gray-700"
            >
              Slug
            </label>
            <Input
              value={form.slug}
              type="text"
              placeholder="Contoh: Pub-X1"
              onChange={(e) => onChange("slug", e.target.value)}
              className="h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-cyan-500/30"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Content
            </label>

            <textarea
              value={form.content}
              placeholder="Masukkan isi berita..."
              onChange={(e) => onChange("content", e.target.value)}
              className="w-full min-h-32 rounded-xl border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              required
            />
          </div>
          <div className=" text-left">
            <label
              htmlFor={labelId}
              className="text-xs sm:text-sm font-semibold text-gray-700"
            >
              Thumnail
            </label>
            <Input
              value={form.thumbnailUrl!}
              type="text"
              placeholder="Contoh: Gambar Publikasi"
              onChange={(e) => onChange("thumbnailUrl", e.target.value)}
              className="h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-cyan-500/30"
              required
            />
          </div>
          {mode === "edit" && (
            <div className="text-left">
              <label
                htmlFor={labelId}
                className="block text-xs sm:text-sm font-semibold text-gray-700"
              >
                Status
              </label>
              <Select
                value={form.status}
                onValueChange={(val) =>
                  onChange("status", val as ContentStatus)
                }
              >
                <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-white text-sm focus:ring-cyan-500/30">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {CONTET_STATUS_OPTIONS.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value}
                      className="text-sm cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50 my-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${status.color}`}
                        />
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-1/3 h-11 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium cursor-pointer shadow-2xs"
            >
              Batalkan
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !form.title || !form.thumbnailUrl}
              className="flex-1 h-11 rounded-xl bg-[#0E7490] hover:bg-[#155e75] text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              <Check className="size-4 stroke-[2.5]" />
              <span>{isSubmitting ? "Menyimpan..." : "Simpan News"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsCreateDialog;
