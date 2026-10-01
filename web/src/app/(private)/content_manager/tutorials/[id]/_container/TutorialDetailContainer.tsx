'use client';

import { ArrowLeft, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useApi from '@/hooks/useApi';

// Register the web component if running in browser
if (typeof window !== 'undefined') {
  import('@aejkatappaja/phantom-ui');
}

// ponytail: duplikasi toEmbedUrl kecil juga ada di TutorialsCreateMetadataCard; pindah ke util bila dipakai di >2 tempat
function toEmbedUrl(raw?: string | null): string | null {
  if (!raw) return null;
  const url = raw.trim();
  if (!url) return null;
  if (url.includes('/embed/')) return url;
  const watch = url.match(/[?&]v=([\w-]{6,})/);
  if (url.includes('youtube.com/watch') && watch) {
    return `https://www.youtube.com/embed/${watch[1]}`;
  }
  const short = url.match(/youtu\.be\/([\w-]{6,})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const shorts = url.match(/youtube\.com\/shorts\/([\w-]{6,})/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
  return null;
}

function formatDuration(totalSeconds?: number | null): string {
  if (!totalSeconds || totalSeconds <= 0) return '-';
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} mnt`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} jam` : `${hours} jam ${rest} mnt`;
}

export interface TutorialDetailContainerProps {
  id: string;
}

const TutorialDetailContainer: React.FC<TutorialDetailContainerProps> = ({ id }) => {
  const router = useRouter();
  const { content } = useApi();
  const {
    data: tutorialItem,
    isLoading,
    isError,
  } = content.query.cmsTutorialDetail(id, {
    enabled: Boolean(id),
  });

  const embedUrl = tutorialItem
    ? (toEmbedUrl(tutorialItem.youtube_embed_url) ?? toEmbedUrl(tutorialItem.youtube_url))
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-8 font-semibold"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </button>

      {isLoading && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200">
          <phantom-ui
            loading="true"
            animation="shimmer"
            count="1"
            style={{ height: '32px', width: '50%', marginBottom: '16px' }}
          ></phantom-ui>
          <phantom-ui
            loading="true"
            animation="shimmer"
            count="1"
            style={{ height: '16px', width: '20%', marginBottom: '40px' }}
          ></phantom-ui>

          <div className="space-y-4">
            <phantom-ui
              loading="true"
              animation="shimmer"
              count="3"
              count-gap="12"
              style={{ height: '16px', width: '100%' }}
            ></phantom-ui>
            <phantom-ui
              loading="true"
              animation="shimmer"
              count="1"
              style={{ height: '16px', width: '80%' }}
            ></phantom-ui>

            <div className="h-6"></div>

            <phantom-ui
              loading="true"
              animation="shimmer"
              count="2"
              count-gap="12"
              style={{ height: '16px', width: '100%' }}
            ></phantom-ui>
            <phantom-ui
              loading="true"
              animation="shimmer"
              count="1"
              style={{ height: '16px', width: '60%' }}
            ></phantom-ui>
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="py-20 text-center text-slate-500">
          Gagal memuat video atau tutorial tidak ditemukan.
        </div>
      )}

      {!isLoading && !isError && tutorialItem && (
        <article className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
          <div className="mb-8 border-b border-slate-100 pb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
              {tutorialItem.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">
                {tutorialItem.category || 'Umum'}
              </span>
              <span>•</span>
              <span>
                {new Date(tutorialItem.created_at || new Date()).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {embedUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 mb-8">
              <iframe
                src={embedUrl}
                title={tutorialItem.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm font-medium text-rose-600 mb-8">
              URL video tidak valid atau belum tersedia.
            </div>
          )}

          {tutorialItem.description && (
            <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-8">
              {tutorialItem.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[160px] bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Status</p>
              <p className="text-xs font-semibold text-slate-700">{tutorialItem.status}</p>
            </div>
            <div className="flex-1 min-w-[160px] bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Durasi</p>
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatDuration(tutorialItem.duration_seconds)}
              </p>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default TutorialDetailContainer;
