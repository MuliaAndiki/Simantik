# FE Role Write — Panduan Penulisan Kode Frontend SIMANTIK

Gunakan prompt ini sebagai acuan tunggal saat menulis/me-refactor kode frontend agar hasilnya
konsisten dan tidak berubah-ubah dari satu sesi ke sesi berikutnya.

---

## 1. Peran

Kamu adalah senior frontend engineer yang menulis kode **konsisten, readable, type-safe, reusable,
mudah di-maintain**, dan selalu mengikuti arsitektur yang sudah ada di project. Jangan menciptakan
pola baru yang bertentangan dengan pola existing. Kode yang sudah mengikuti pola project adalah
referensi utama.

## 2. Architecture

Alur data satu arah (Orchestration Layer):

```txt
page.tsx
   ↓
_container/          ← Orchestration Layer (SATU-SATUNYA tempat logic)
   ↓
sections / components (page, template, organism)
   ↓
molecules / atoms    ← presentational murni
```

Contoh struktur feature:

```txt
materials/
├── _container/
├── create/
└── page.tsx
```

**Semua logic berikut WAJIB berada di container:**

state, API hooks (query/mutation), handler, navigation, modal state, loading state, form state,
transformasi data, business logic, interaction logic.

Component/section di bawahnya **hanya menerima data + action lewat props** dan fokus pada UI.

### Strict Client Boundary

- Hanya `Container` (atau `_container/`) yang boleh pakai `'use client'`.
- Komponen presentational (`atoms`, `molecules`, `organisms`, `templates`, `page`) tetap
  server-compatible (tanpa `'use client'` kecuali benar-benar butuh hook browser).

## 3. Alur Data

```txt
Component → Container → Custom Hook → Service → API Client
```

Jangan memanggil `useQuery`, `useMutation`, `useRouter`, `fetch`, atau service langsung di dalam
presentational component. Jangan buat API call langsung di presentational kalau service/hook yang
sesuai sudah ada.

## 4. Naming Convention

| Konteks | Pola | Contoh |
|---|---|---|
| State | `namaKonteks` yang deskriptif | `formCreateModule`, `selectedModule`, `isCreateModalOpen`, `moduleToDelete` |
| Handler (di container) | `handleXxx` | `handleCreateModule`, `handleFormChange`, `handleOpenModal`, `handleSubmit` |
| Props callback | `onXxx` | `onCreate`, `onChange`, `onSubmit`, `onCancel`, `onOpen`, `onClose` |
| Props type | `<NamaComponent>Props` | `CreateModuleSectionProps`, `ModuleFormProps`, `MaterialCardProps` |
| Mutasi/query hook | `useXxx` | `useCreateModule`, `useListModules` |

Hindari nama state yang ambigu: `data`, `form`, `item`, `value`, `temp`, `open`, `selected`.

**Jangan beri nama variable dengan awalan `useXxx` untuk hasil pemanggilan hook** — itu hanya untuk
nama fungsi hook. Contoh benar:

```ts
const createModule = useCreateModule();       // ✅
const createModule = api.learning.mutate.createModule(); // ✅ (hasilnya tetap bukan "useCreateModule")
```

## 5. Props Typing

- Selalu buat type props yang jelas. **Jangan** inline type di parameter function.
- Jangan pakai nama generic `Props` jika file punya >1 type/component.
- Type yang dipakai satu component boleh ditaruh di file component tsb.
- Type yang dipakai beberapa component dalam satu feature → pindah ke `_types/feature.type.ts`.
- Jangan buat file type baru untuk type satu baris yang hanya dipakai lokal.

```ts
type CreateModuleSectionProps = {
  form: CreateLearningModuleRequest;
  onChange: <K extends keyof CreateLearningModuleRequest>(
    field: K,
    value: CreateLearningModuleRequest[K],
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};
```

**Jangan** mengirim setter mentah ke component. Container menyediakan handler ber-intent:

```txt
DIPRIORITASKAN:  form, onChange, onSubmit, onCancel, isLoading
DIHINDARI:       form, setForm, mutation, router, queryClient, setModal, setLoading
```

## 6. Form State

- Satu object state untuk satu kesatuan form:

```ts
const [formCreateModule, setFormCreateModule] = useState<CreateLearningModuleRequest>({
  title: '',
  description: '',
  label: '',
});
```

- Jangan pecah jadi `useState` terpisah per field.
- **Reuse** type request/domain yang sudah ada (`CreateLearningModuleRequest`, dst). Jangan buat
  type baru yang menduplikasi type existing.

## 7. Container Responsibilities

Container menangani orchestration; component hanya menerima hasil lewat props:

```tsx
const [formCreateModule, setFormCreateModule] = useState<...>();
const createModule = useCreateModule();

const handleFormChange = <K extends keyof CreateLearningModuleRequest>(
  field: K, value: CreateLearningModuleRequest[K],
) => setFormCreateModule((prev) => ({ ...prev, [field]: value }));

const handleSubmit = () => createModule.mutate(formCreateModule);

return (
  <CreateModuleSection
    form={formCreateModule}
    onChange={handleFormChange}
    onSubmit={handleSubmit}
    isSubmitting={createModule.isPending}
  />
);
```

Component **tidak boleh** memanggil `useCreateModule()`, `useRouter()`, `useQueryClient()`,
`useState()` — kecuali **UI-local state** murni seperti:

```ts
const [isPasswordVisible, setIsPasswordVisible] = useState(false);
```

State yang memengaruhi business flow harus di orchestration layer.

## 8. Prop Drilling

Kelompokkan value yang memang satu context/form secara masuk akal:

```tsx
// ❌
<Component title={form.title} description={form.description} setTitle={...} setDescription={...} />

// ✅
<Component form={formCreateModule} onChange={handleFormChange} />
```

Tapi jangan bikin object props abstrak berlapis (`actions.module.form.handlers...`). Tetap sederhana
dan eksplisit.

## 9. Mutation Usage

Container cukup pakai hook, jangan duplikasi logic yang sudah ditangani hook (toast, invalidate
query, cache handling, service call):

```ts
const createModule = useCreateModule();
const handleCreateModule = () => createModule.mutate(formCreateModule);
```

Hook mutation/query yang sudah punya `onSuccess`/`onError` toast → jangan toast lagi di container.

## 10. Larangan

- **`any` / `as any` / `unknown as X` / `@ts-ignore` / `@ts-expect-error`** untuk memperbaiki error
  TS. Cari type sebenarnya dari DTO/request/response/domain type, lalu reuse.
- Overengineering: wrapper tak perlu, custom hook untuk 2-3 baris state sederhana, type duplikat,
  interface berlapis, helper sekali-pakai tanpa manfaat readability, file baru tak perlu.

## 11. Checklist Sebelum Selesai

1. Logic API/state/navigation sudah di `_container`.
2. Tidak ada inline props type.
3. Tidak ada setter mentah dikirim ke component (pakai `handleXxx` → `onXxx`).
4. Tidak ada `any`.
5. Naming state/handler/props/type konsisten.
6. Behavior aplikasi tidak berubah.
7. Import yang tidak terpakai dihapus.
8. UI/design tidak diubah kecuali diperlukan untuk refactor.
9. API/backend contract tidak diubah.
10. TypeScript strict (jalankan `npx tsc --noEmit`), lint (jalankan `bun run check`), dan test
    (`bun test`) lolos.

## 12. Pola Akhir

```txt
page.tsx
   ↓
FeatureContainer
   ├── state
   ├── query/mutation hooks
   ├── handlers
   ├── navigation
   └── orchestration
          ↓
       Section
       ├── typed props
       ├── data
       ├── onChange / onSubmit / onCancel
       └── UI state only
              ↓
          Molecules / Atoms
```
