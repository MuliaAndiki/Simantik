'use client';

import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Minus,
  Plus,
  QrCode,
  RotateCcw,
  ScanLine,
  Smartphone,
  ZoomIn,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function FloatingPwaQrCard() {
  const [pwaUrl, setPwaUrl] = useState('https://simantik.educourse.id/home');
  const [isMinimized, setIsMinimized] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState(280);
  const [copied, setCopied] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const { canInstall, promptInstall, isStandalone } = usePWAInstall();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPwaUrl(`${window.location.origin}/home`);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pwaUrl);
      setCopied(true);
      setFeedbackMsg('Tautan berhasil disalin!');
      setTimeout(() => {
        setCopied(false);
        setFeedbackMsg(null);
      }, 2500);
    } catch {
      setFeedbackMsg('Gagal menyalin tautan');
      setTimeout(() => setFeedbackMsg(null), 2000);
    }
  };

  const handleDirectInstall = async () => {
    if (isStandalone) {
      setFeedbackMsg('SIMANTIK sudah terpasang di perangkat ini!');
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    if (canInstall) {
      const installed = await promptInstall();
      if (installed) {
        setFeedbackMsg('Pemasangan aplikasi berhasil!');
      }
    } else {
      await handleCopyLink();
    }
  };

  const handleModalZoomIn = () => {
    setModalSize((prev) => Math.min(380, prev + 30));
  };

  const handleModalZoomOut = () => {
    setModalSize((prev) => Math.max(200, prev - 30));
  };

  const handleModalReset = () => {
    setModalSize(280);
  };

  return (
    <>
      {/* Minimized Floating Pill */}
      {isMinimized ? (
        <aside
          aria-label="Pemasangan Aplikasi SIMANTIK"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 animate-in fade-in zoom-in-95 duration-200"
        >
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#134653]/95 hover:bg-[#0E323C] text-white border border-[#4CA7B1]/40 shadow-xl shadow-[#0E323C]/60 transition-all hover:scale-105 cursor-pointer backdrop-blur-md group"
            title="Buka QR Pasang Aplikasi SIMANTIK"
            aria-label="Buka QR Pasang Aplikasi SIMANTIK"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CA7B1] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4CA7B1]" />
            </span>
            <Smartphone className="w-4 h-4 text-[#F5B731] group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold text-white">Pasang di HP</span>
            <QrCode className="w-3.5 h-3.5 text-teal-300" />
          </button>
        </aside>
      ) : (
        /* Floating Brand Deep Teal QR Card */
        <aside
          aria-label="Pemasangan Aplikasi SIMANTIK"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-64 sm:w-72 bg-[#134653]/95 backdrop-blur-md text-white border border-[#4CA7B1]/35 rounded-2xl p-4 shadow-2xl shadow-teal-950/60 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-2 border-b border-teal-700/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <Smartphone className="w-4 h-4 text-[#F5B731] shrink-0" />
              <h2 className="text-xs font-bold text-white tracking-tight truncate">
                Pasang Aplikasi SIMANTIK di HP
              </h2>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Zoom / Enlarge button */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="p-1 rounded-md text-teal-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Perbesar Kode QR"
                aria-label="Perbesar Kode QR"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Minimize button */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-md text-teal-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Kecilkan widget"
                aria-label="Kecilkan widget"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center White QR Canvas */}
          <div className="my-3 flex justify-center">
            <div
              onClick={() => setModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setModalOpen(true);
              }}
              role="button"
              tabIndex={0}
              className="p-3 bg-white rounded-xl shadow-md border border-teal-500/20 cursor-pointer group relative transition-transform hover:scale-[1.02] flex items-center justify-center"
              title="Klik untuk memperbesar QR"
            >
              <QRCodeSVG
                value={pwaUrl}
                size={152}
                level="H"
                imageSettings={{
                  src: '/favicon/web-app-manifest-192x192.png',
                  height: 34,
                  width: 34,
                  excavate: true,
                }}
                fgColor="#134653"
                bgColor="#FFFFFF"
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 rounded-xl bg-[#134653]/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white font-bold text-xs pointer-events-none">
                <ZoomIn className="w-5 h-5 text-[#F5B731]" />
                <span>Perbesar QR</span>
              </div>
            </div>
          </div>

          {/* Feedback Toast Notification */}
          {feedbackMsg && (
            <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-teal-800/90 border border-teal-400/50 text-[11px] font-semibold text-teal-100 text-center animate-in fade-in duration-150">
              {feedbackMsg}
            </div>
          )}

          {/* Footer Guide & Action Link */}
          <div className="space-y-1.5 pt-1 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-teal-100/90">
              <ScanLine className="w-3.5 h-3.5 text-[#4CA7B1] shrink-0" />
              <span>Scan dengan kamera HP untuk pasang PWA</span>
            </div>

            <button
              type="button"
              onClick={handleDirectInstall}
              className="w-full text-[11px] font-semibold text-[#F5B731] hover:text-[#F7CE46] underline underline-offset-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer py-0.5"
            >
              {isStandalone ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Aplikasi terpasang di perangkat</span>
                </>
              ) : canInstall ? (
                <>
                  <Download className="w-3 h-3 text-[#F5B731]" />
                  <span>Pasang langsung di perangkat ini</span>
                </>
              ) : (
                <>
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-[#F5B731]" />
                  )}
                  <span>
                    {copied
                      ? 'Tautan disalin ke papan klip!'
                      : 'Atau pasang langsung di perangkat ini'}
                  </span>
                </>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* Enlarged Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#134653] text-white border border-[#4CA7B1]/40 rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-teal-800/60 border border-teal-400/30 flex items-center justify-center text-[#F5B731]">
              <Smartphone className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-black text-white">
              Pasang SIMANTIK di Smartphone (PWA)
            </DialogTitle>
            <DialogDescription className="text-xs text-teal-100/80 max-w-sm mx-auto font-normal leading-relaxed">
              Arahkan kamera smartphone ke kode QR di bawah untuk membuka dan memasang SIMANTIK
              langsung ke layar utama ponsel tanpa unduh via Play Store/App Store.
            </DialogDescription>
          </DialogHeader>

          {/* Interactive Zoomable QR Canvas */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-teal-500/20 flex items-center justify-center">
              <QRCodeSVG
                value={pwaUrl}
                size={modalSize}
                level="H"
                imageSettings={{
                  src: '/favicon/web-app-manifest-192x192.png',
                  height: Math.round(modalSize * 0.22),
                  width: Math.round(modalSize * 0.22),
                  excavate: true,
                }}
                fgColor="#134653"
                bgColor="#FFFFFF"
              />
            </div>

            {/* Scale & Zoom Controls */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E323C] border border-teal-700/60 text-xs">
              <button
                type="button"
                onClick={handleModalZoomOut}
                disabled={modalSize <= 200}
                className="w-7 h-7 rounded-full bg-teal-900/80 hover:bg-teal-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Perkecil"
                aria-label="Perkecil kode QR"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-bold text-[#F5B731] px-2 min-w-[70px] text-center">
                {modalSize}px
              </span>

              <button
                type="button"
                onClick={handleModalZoomIn}
                disabled={modalSize >= 380}
                className="w-7 h-7 rounded-full bg-teal-900/80 hover:bg-teal-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Perbesar"
                aria-label="Perbesar kode QR"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleModalReset}
                className="w-7 h-7 rounded-full bg-teal-900/80 hover:bg-teal-800 flex items-center justify-center text-teal-200 hover:text-white transition-colors cursor-pointer ml-1"
                title="Reset Ukuran Normal"
                aria-label="Reset ukuran kode QR"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3 Quick Steps */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-teal-700/60">
            <div className="p-2 rounded-xl bg-[#0E323C]/90 border border-teal-800/80 space-y-1">
              <span className="inline-block text-[10px] font-black text-[#1A4D5C] bg-[#F5B731] px-1.5 py-0.5 rounded-md">
                Langkah 1
              </span>
              <p className="text-[10px] text-teal-100/90 leading-tight">Pindai QR dengan kamera</p>
            </div>
            <div className="p-2 rounded-xl bg-[#0E323C]/90 border border-teal-800/80 space-y-1">
              <span className="inline-block text-[10px] font-black text-[#1A4D5C] bg-[#F5B731] px-1.5 py-0.5 rounded-md">
                Langkah 2
              </span>
              <p className="text-[10px] text-teal-100/90 leading-tight">Buka di Chrome / Safari</p>
            </div>
            <div className="p-2 rounded-xl bg-[#0E323C]/90 border border-teal-800/80 space-y-1">
              <span className="inline-block text-[10px] font-black text-[#1A4D5C] bg-[#F5B731] px-1.5 py-0.5 rounded-md">
                Langkah 3
              </span>
              <p className="text-[10px] text-teal-100/90 leading-tight">
                Pilih &quot;Pasang ke Layar&quot;
              </p>
            </div>
          </div>

          {/* Action Buttons in Modal */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full sm:flex-1 h-10 rounded-xl bg-[#0E323C] hover:bg-[#1A4D5C] border border-teal-700/60 text-xs font-bold text-teal-100 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#F5B731]" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>

            {canInstall && (
              <button
                type="button"
                onClick={handleDirectInstall}
                className="w-full sm:flex-1 h-10 rounded-xl bg-[#F5B731] hover:bg-[#E5A721] text-[#1A4D5C] text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Pasang Sekarang</span>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
