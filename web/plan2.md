Saya ingin kamu mengimplementasikan sistem **anti-cheating / browser proctoring** untuk fitur Tryout pada project SIMANTIK.

Project menggunakan:

* Next.js App Router
* TypeScript
* React
* TanStack Query
* Arsitektur frontend Atomic Design + orchestration layer
* `use client` sebisa mungkin hanya berada pada layer container/provider yang membutuhkan state/browser API
* Backend terpisah menggunakan GoFiber

Saya ingin implementasi dibuat **clean, modular, reusable, type-safe, dan mudah dikembangkan**, bukan menaruh seluruh event listener langsung di halaman Tryout.

## Goal

Buat sebuah `ProctoringContext` / `ProctoringProvider` yang digunakan selama student sedang mengerjakan Tryout.

Provider ini bertanggung jawab mendeteksi beberapa bentuk pelanggaran ketika ujian berlangsung.

Minimal pelanggaran yang harus dideteksi:

1. User berpindah tab browser
2. Browser/window kehilangan focus
3. User keluar dari fullscreen
4. User melakukan copy
5. User melakukan paste
6. User melakukan cut
7. User membuka context menu / right click
8. Optional: detect shortcut tertentu seperti:

   * Ctrl+C
   * Ctrl+V
   * Ctrl+X
   * Ctrl+Shift+I
   * F12

Untuk DevTools detection jangan gunakan hack yang unreliable atau menyebabkan false positive. Cukup deteksi keyboard shortcut sebagai indikasi attempt jika diperlukan.

---

# 1. Architecture

Saya ingin struktur kurang lebih seperti:

```text
src/
├── contexts/
│   └── proctoring/
│       ├── ProctoringContext.tsx
│       ├── ProctoringProvider.tsx
│       ├── proctoring.types.ts
│       ├── proctoring.constants.ts
│       └── index.ts
│
├── hooks/
│   └── useProctoring.ts
│
└── components/
    └── ...
```

Silakan sesuaikan dengan struktur project existing apabila sudah ada convention tertentu.

Jangan membuat struktur baru yang bertabrakan dengan pattern project.

---

# 2. Proctoring Event Type

Gunakan typed violation event.

Contoh:

```ts
export type ProctoringViolationType =
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'EXIT_FULLSCREEN'
  | 'COPY_ATTEMPT'
  | 'PASTE_ATTEMPT'
  | 'CUT_ATTEMPT'
  | 'RIGHT_CLICK'
  | 'DEVTOOLS_SHORTCUT';
```

Buat interface seperti:

```ts
export interface ProctoringViolation {
  id: string;
  type: ProctoringViolationType;
  timestamp: number;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}
```

Jika lebih baik menggunakan enum/const object sesuai convention project, silakan gunakan approach tersebut.

---

# 3. Context State

`ProctoringContext` minimal menyediakan:

```ts
interface ProctoringContextValue {
  isActive: boolean;
  isFullscreen: boolean;

  violationCount: number;
  violations: ProctoringViolation[];

  lastViolation: ProctoringViolation | null;

  startProctoring: () => Promise<void>;
  stopProctoring: () => void;

  enterFullscreen: () => Promise<void>;
  reportViolation: (
    type: ProctoringViolationType,
    metadata?: Record<string, unknown>
  ) => void;
}
```

Boleh ditambahkan property lain jika memang dibutuhkan.

---

# 4. Start Proctoring

Ketika:

```ts
startProctoring()
```

dipanggil:

* set `isActive = true`
* request fullscreen
* register seluruh browser event listener
* reset state jika memang session baru
* mulai mendeteksi pelanggaran

Jangan langsung aktif ketika provider mount.

Proctoring hanya aktif setelah user benar-benar memulai Tryout.

---

# 5. Stop Proctoring

Ketika:

```ts
stopProctoring()
```

dipanggil:

* set `isActive = false`
* remove seluruh listener
* jangan lagi mencatat violation
* cleanup resources

Pastikan tidak terjadi duplicated event listener apabila component rerender.

Pastikan cleanup dilakukan ketika provider unmount.

---

# 6. Detect Tab Switch

Gunakan:

```ts
document.addEventListener('visibilitychange', ...)
```

Jika:

```ts
document.hidden === true
```

maka:

```ts
reportViolation('TAB_SWITCH');
```

Jangan report ketika proctoring belum aktif.

---

# 7. Detect Window Blur

Gunakan:

```ts
window.addEventListener('blur', ...)
```

dan report:

```ts
WINDOW_BLUR
```

Tetapi hati-hati terhadap duplicate violation.

Contohnya berpindah tab bisa menyebabkan:

```text
visibilitychange
+
blur
```

terjadi hampir bersamaan.

Implementasikan **debounce / deduplication strategy** agar satu tindakan user tidak menghasilkan spam violation.

Misalnya event yang sama / berkaitan dalam 500–1000 ms hanya dihitung satu kali jika masuk akal.

Buat logic ini clean dan mudah dikonfigurasi.

---

# 8. Fullscreen

Gunakan browser Fullscreen API:

```ts
document.documentElement.requestFullscreen()
```

dan monitor:

```ts
document.addEventListener('fullscreenchange', ...)
```

Jika ujian sedang aktif dan:

```ts
document.fullscreenElement === null
```

maka:

```ts
reportViolation('EXIT_FULLSCREEN');
```

Tetapi jangan langsung force user masuk fullscreen kembali tanpa UX yang jelas.

Expose state:

```ts
isFullscreen
```

agar UI dapat menampilkan modal seperti:

```text
Anda keluar dari mode fullscreen.
Silakan kembali ke fullscreen untuk melanjutkan ujian.
```

Sediakan:

```ts
enterFullscreen()
```

untuk dipanggil dari tombol modal.

---

# 9. Copy / Paste / Cut

Listen ke:

```ts
document.addEventListener('copy')
document.addEventListener('paste')
document.addEventListener('cut')
```

Report masing-masing:

```text
COPY_ATTEMPT
PASTE_ATTEMPT
CUT_ATTEMPT
```

Untuk halaman Tryout, boleh:

```ts
event.preventDefault();
```

tetapi jadikan behavior ini configurable dari provider.

Misalnya:

```ts
<ProctoringProvider
  config={{
    preventCopy: true,
    preventPaste: true,
    preventCut: true,
  }}
>
```

---

# 10. Right Click

Listen ke:

```ts
contextmenu
```

Ketika proctoring aktif:

```ts
event.preventDefault();
reportViolation('RIGHT_CLICK');
```

Behavior prevention juga sebaiknya configurable.

---

# 11. Keyboard Shortcut

Tambahkan listener:

```ts
keydown
```

Detect minimal:

```text
F12
Ctrl + Shift + I
Ctrl + Shift + J
Ctrl + Shift + C
```

Jika terdeteksi:

```ts
reportViolation('DEVTOOLS_SHORTCUT')
```

Jika memang diperlukan, prevent default.

Jangan implementasikan hack seperti:

* mengecek selisih `window.outerWidth`
* debugger timing
* console tricks
* infinite debugger
* DevTools detection library yang unreliable

karena berpotensi menyebabkan false positive.

---

# 12. Config

Buat config agar provider reusable.

Contoh:

```ts
export interface ProctoringConfig {
  requireFullscreen?: boolean;

  preventCopy?: boolean;
  preventPaste?: boolean;
  preventCut?: boolean;
  preventContextMenu?: boolean;
  preventDevtoolsShortcut?: boolean;

  maxViolations?: number;

  deduplicationWindowMs?: number;
}
```

Berikan default config.

Contoh:

```ts
const DEFAULT_PROCTORING_CONFIG = {
  requireFullscreen: true,
  preventCopy: true,
  preventPaste: true,
  preventCut: true,
  preventContextMenu: true,
  preventDevtoolsShortcut: true,

  maxViolations: 3,

  deduplicationWindowMs: 750,
};
```

---

# 13. Violation Callback

Provider harus mendukung callback:

```ts
onViolation?: (violation: ProctoringViolation) => void;
```

dan:

```ts
onMaxViolationReached?: (
  violations: ProctoringViolation[]
) => void;
```

Contoh penggunaan:

```tsx
<ProctoringProvider
  config={{
    maxViolations: 3,
  }}
  onViolation={(violation) => {
    // send to API
  }}
  onMaxViolationReached={() => {
    // auto submit tryout
  }}
>
```

Jangan hardcode API request langsung ke Context apabila project menggunakan service/query layer.

Context hanya meng-handle browser proctoring state/event.

API synchronization dilakukan oleh orchestration/container layer.

---

# 14. Backend Integration

Siapkan provider agar mudah diintegrasikan dengan endpoint misalnya:

```http
POST /tryouts/:sessionId/violations
```

Payload yang kemungkinan akan digunakan:

```json
{
  "type": "TAB_SWITCH",
  "occurred_at": "2026-09-15T13:00:00.000Z",
  "metadata": {
    "visibilityState": "hidden"
  }
}
```

Tetapi jangan membuat endpoint backend baru kecuali memang task ini juga memiliki akses backend.

Jika frontend service untuk endpoint tersebut belum ada, cukup buat integration point melalui:

```ts
onViolation
```

Jangan mencampurkan `fetch` langsung ke Context.

---

# 15. Threshold

Provider harus mengetahui:

```ts
maxViolations
```

Misalnya:

```text
Violation 1
→ Warning pertama

Violation 2
→ Warning kedua

Violation 3
→ onMaxViolationReached()
```

Pastikan callback hanya dipanggil **sekali** ketika threshold tercapai.

Jangan trigger berkali-kali akibat rerender/event tambahan.

---

# 16. Hook

Buat hook:

```ts
export const useProctoring = () => {
  const context = useContext(ProctoringContext);

  if (!context) {
    throw new Error(
      'useProctoring must be used within ProctoringProvider'
    );
  }

  return context;
};
```

Usage:

```tsx
const {
  violationCount,
  lastViolation,
  isFullscreen,
  startProctoring,
  enterFullscreen,
} = useProctoring();
```

---

# 17. Usage pada Tryout

Target integration kurang lebih:

```tsx
<ProctoringProvider
  config={{
    requireFullscreen: true,
    maxViolations: 3,
  }}
  onViolation={handleViolation}
  onMaxViolationReached={handleAutoSubmit}
>
  <TryoutSessionContainer />
</ProctoringProvider>
```

Ketika student menekan:

```text
Mulai Tryout
```

baru jalankan:

```ts
await startProctoring();
```

Jangan mulai proctoring hanya karena page dibuka.

---

# 18. Warning UI

Context tidak perlu memiliki UI.

Namun expose data yang cukup agar container dapat menampilkan warning.

Contoh:

```ts
lastViolation
violationCount
isFullscreen
```

UI nantinya dapat menampilkan:

```text
Peringatan

Anda terdeteksi meninggalkan halaman ujian.

Pelanggaran 1 dari 3.
```

atau:

```text
Fullscreen Required

Anda keluar dari mode fullscreen.
Kembali ke fullscreen untuk melanjutkan ujian.
```

Pisahkan business logic dan presentation.

---

# 19. SSR Safety

Karena Next.js menggunakan SSR:

Jangan mengakses:

```ts
window
document
```

di luar client execution.

Pastikan file yang membutuhkan browser API menggunakan:

```ts
'use client';
```

dan event listener hanya dipasang di client.

Jangan sampai menyebabkan error:

```text
ReferenceError: window is not defined
```

atau hydration mismatch.

---

# 20. Event Listener Safety

Perhatikan masalah:

```text
stale closure
duplicate listener
memory leak
duplicate violation
```

Gunakan approach seperti:

* `useCallback`
* `useRef`
* proper `useEffect` cleanup

jika memang dibutuhkan.

Pastikan:

```text
start
stop
start
stop
```

berkali-kali tetap aman.

---

# 21. Mobile Compatibility

Tryout SIMANTIK bersifat mobile-first.

Pastikan logic tidak mengasumsikan desktop saja.

Beberapa browser mobile memiliki keterbatasan Fullscreen API.

Handle dengan graceful degradation.

Jangan crash apabila:

```ts
document.documentElement.requestFullscreen
```

tidak tersedia.

Expose kemampuan browser jika perlu:

```ts
supportsFullscreen
```

atau cukup handle secara internal.

---

# 22. Browser API Limitation

Jangan membuat klaim seolah sistem ini bisa mendeteksi semua kecurangan.

Frontend browser proctoring hanya dapat mendeteksi event yang tersedia melalui browser.

Jangan mencoba mendeteksi:

* user menggunakan HP kedua
* user melihat catatan fisik
* user membuka aplikasi di device lain
* user merekam layar dari device lain

kecuali nantinya ada sistem webcam / native application.

---

# 23. Code Quality

Implementation harus:

* TypeScript strict-friendly
* Tidak menggunakan `any` jika tidak diperlukan
* Tidak duplicate code
* Tidak membuat giant component/provider
* Naming jelas
* Tidak over-engineering
* Mudah ditest
* Mudah dikembangkan untuk webcam proctoring di masa depan

Pisahkan:

```text
types
constants
context
provider
hook
```

jika memang membantu maintainability.

---

# 24. Jangan Ubah Architecture Existing

Sebelum coding:

1. Inspect terlebih dahulu struktur project.
2. Cari pattern existing untuk:

   * Context
   * Provider
   * hooks
   * service
   * query/mutation
   * container
3. Ikuti convention project yang sudah ada.

Jangan membuat duplicate abstraction apabila project sudah mempunyai pattern serupa.

Jangan refactor bagian unrelated.

---

# 25. Expected Result

Setelah selesai saya ingin bisa menggunakan sistem kurang lebih seperti:

```tsx
const TryoutSessionContainer = () => {
  const {
    violationCount,
    lastViolation,
    isFullscreen,
    startProctoring,
    enterFullscreen,
  } = useProctoring();

  return (
    <>
      ...
    </>
  );
};
```

dan provider:

```tsx
<ProctoringProvider
  config={{
    requireFullscreen: true,
    maxViolations: 3,
    preventCopy: true,
    preventPaste: true,
    preventContextMenu: true,
  }}
  onViolation={handleViolation}
  onMaxViolationReached={handleAutoSubmit}
>
  <TryoutSessionContainer />
</ProctoringProvider>
```

Behavior akhir:

```text
Student Start Tryout
        ↓
Request Fullscreen
        ↓
Proctoring Active
        ↓
Detect Browser Violation
        ↓
Create Typed Violation
        ↓
Update Context State
        ↓
onViolation()
        ↓
Backend Log
        ↓
Warning UI
        ↓
Reached Maximum Violation?
        ↓
Yes
        ↓
Auto Submit Tryout
```

Implementasikan sekarang berdasarkan architecture existing project.

Setelah implementation:

1. Tampilkan file apa saja yang dibuat/diubah.
2. Jelaskan singkat responsibility masing-masing file.
3. Jelaskan event browser apa saja yang dideteksi.
4. Jelaskan mekanisme deduplication violation.
5. Jelaskan bagaimana mengintegrasikannya ke Tryout Session.
6. Jalankan TypeScript/lint check yang tersedia pada project dan perbaiki error yang berasal dari perubahan ini.
7. Jangan mengubah fitur unrelated.
