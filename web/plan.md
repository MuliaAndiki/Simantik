Saya ingin kamu melakukan **refactor dan standardisasi penulisan code** pada file-file yang saya tag berdasarkan architecture pattern project ini.

Tujuan utama refactor ini adalah membuat code:

* konsisten,
* readable,
* type-safe,
* reusable,
* mudah di-maintain,
* tidak memiliki inline type yang berantakan,
* dan mengikuti pattern **Orchestration Layer** yang sudah digunakan di project.

## Architecture Rule

Project menggunakan pattern:

```txt
page.tsx
   ↓
_container/
   ↓
sections / components
   ↓
atoms / molecules
```

Contoh struktur:

```txt
materials/
├── _container/
├── create/
└── page.tsx
```

`_container` adalah **Orchestration Layer**.

Semua logic berikut harus sebisa mungkin berada di container:

* state
* API hooks
* mutation/query
* handler
* navigation
* modal state
* loading state
* form state
* transformation data
* business logic
* interaction logic

Sedangkan component/section di bawahnya sebisa mungkin hanya menerima data dan action melalui props dan fokus pada UI.

---

## 1. API Hooks Pattern

Gunakan pattern hooks seperti ini sebagai referensi:

```ts
export function useCreateModule() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<LearningModuleResponse>,
    Error,
    CreateLearningModuleRequest,
    LearningCacheContext
  >({
    mutationFn: (body: CreateLearningModuleRequest) =>
      Api.learning.CreateModuleService(body),

    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
    },

    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.learningRoot(),
      });

      const previousModules = readLearningSnapshot(ns);

      return { previousModules };
    },

    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },

    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
```

Jangan membuat API call langsung di presentational component apabila sudah ada service/hook yang sesuai.

Gunakan flow:

```txt
Component
   ↓
Container
   ↓
Custom Hook
   ↓
Service
   ↓
API Client
```

---

## 2. Form State Pattern

Untuk form, gunakan satu object state apabila field-field tersebut merupakan satu kesatuan form.

Contoh:

```ts
const [formCreateModule, setFormCreateModule] =
  useState<CreateLearningModuleRequest>({
    title: '',
    description: '',
    label: '',
  });
```

Jangan membuat:

```ts
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [label, setLabel] = useState('');
```

jika semuanya merupakan satu form yang sama.

Gunakan type request/domain yang sudah tersedia apabila memang cocok, misalnya:

```ts
CreateLearningModuleRequest
```

Jangan membuat type baru yang sebenarnya menduplikasi type yang sudah ada.

---

## 3. Props Typing

Jangan menulis type props secara asal atau inline seperti:

```ts
{
  formCreateModule: CreateLearningModuleRequest;
  setFormCreateModule: React.Dispatch<
    React.SetStateAction<CreateLearningModuleRequest>
  >;
}
```

atau:

```ts
function Component({
  form,
  setForm,
}: {
  form: CreateLearningModuleRequest;
  setForm: React.Dispatch<
    React.SetStateAction<CreateLearningModuleRequest>
  >;
}) {}
```

Buat type props yang jelas dan terstruktur.

Contoh:

```ts
type CreateModuleSectionProps = {
  formCreateModule: CreateLearningModuleRequest;
  setFormCreateModule: React.Dispatch<
    React.SetStateAction<CreateLearningModuleRequest>
  >;
};
```

Kemudian:

```ts
export function CreateModuleSection({
  formCreateModule,
  setFormCreateModule,
}: CreateModuleSectionProps) {
  // ...
}
```

Jika props mulai banyak, jangan terus menambahkan setter mentah ke component.

Lebih baik container menyediakan handler yang memiliki intent jelas.

Contoh:

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

Container:

```ts
const handleFormChange = <K extends keyof CreateLearningModuleRequest>(
  field: K,
  value: CreateLearningModuleRequest[K],
) => {
  setFormCreateModule((prev) => ({
    ...prev,
    [field]: value,
  }));
};
```

Dengan begitu component di bawah tidak perlu mengetahui implementation detail berupa `setState`.

Prioritaskan:

```txt
form
onChange
onSubmit
onCancel
isLoading
```

daripada:

```txt
form
setForm
mutation
router
queryClient
setModal
setLoading
```

Presentational component tidak perlu mengetahui orchestration internal.

---

## 4. Props Type Organization

Gunakan nama type berdasarkan component:

```ts
type CreateModuleSectionProps = {}
type ModuleFormProps = {}
type MaterialCardProps = {}
type MaterialTableProps = {}
```

Jangan gunakan nama generic seperti:

```ts
type Props = {}
```

jika file memiliki lebih dari satu type/component atau nama tersebut membuat context menjadi tidak jelas.

Jika type hanya digunakan oleh satu component, type boleh berada di file component tersebut.

Jika digunakan oleh beberapa component dalam satu feature, pindahkan ke file type feature, misalnya:

```txt
materials/
├── _container/
│   └── MaterialsContainer.tsx
├── _components/
├── _types/
│   └── materials.type.ts
└── page.tsx
```

Jangan membuat file type baru jika type tersebut hanya satu baris dan hanya digunakan secara lokal.

---

## 5. Container Responsibilities

Container harus menangani orchestration seperti:

```ts
const [formCreateModule, setFormCreateModule] = useState<...>();

const createModule = useCreateModule();

const handleFormChange = (...) => {
  ...
};

const handleSubmit = () => {
  createModule.mutate(formCreateModule);
};

return (
  <CreateModuleSection
    form={formCreateModule}
    onChange={handleFormChange}
    onSubmit={handleSubmit}
    isSubmitting={createModule.isPending}
  />
);
```

Section/component tidak boleh melakukan:

```ts
useCreateModule();
useRouter();
useQueryClient();
useState();
```

kecuali state tersebut memang benar-benar **UI-local state**, misalnya:

```ts
const [isPasswordVisible, setIsPasswordVisible] = useState(false);
```

State yang mempengaruhi business flow harus berada di orchestration layer.

---

## 6. Avoid Prop Drilling yang Tidak Perlu

Jika beberapa value memang satu context/form, kelompokkan secara masuk akal.

Jangan membuat:

```tsx
<Component
  title={form.title}
  description={form.description}
  label={form.label}
  setTitle={...}
  setDescription={...}
  setLabel={...}
/>
```

Lebih baik:

```tsx
<Component
  form={formCreateModule}
  onChange={handleFormChange}
/>
```

Tetapi jangan juga membuat object props abstrak yang tidak diperlukan seperti:

```tsx
<Component
  actions={{
    module: {
      form: {
        handlers: {
          ...
        },
      },
    },
  }}
/>
```

Tetap sederhana dan eksplisit.

---

## 7. Handler Naming

Gunakan naming yang konsisten:

```ts
handleCreateModule
handleUpdateModule
handleDeleteModule
handleFormChange
handleOpenModal
handleCloseModal
handleSubmit
handleResetForm
```

Untuk props gunakan:

```ts
onCreate
onUpdate
onDelete
onChange
onSubmit
onCancel
onOpen
onClose
```

Pattern:

```txt
Container implementation → handleXxx
Component props         → onXxx
```

Contoh:

```tsx
<CreateModuleSection
  onSubmit={handleCreateModule}
  onCancel={handleCancel}
/>
```

---

## 8. Jangan Gunakan `any`

Tidak boleh memperbaiki error TypeScript dengan:

```ts
any
as any
unknown as X
// @ts-ignore
// @ts-expect-error
```

Cari type sebenarnya dari:

* DTO
* API request
* API response
* domain type
* existing type definitions

Reuse existing type jika tersedia.

---

## 9. State Naming

Gunakan nama state yang menjelaskan context.

Good:

```ts
formCreateModule
selectedModule
isCreateModalOpen
isEditModalOpen
moduleToDelete
```

Avoid:

```ts
data
form
item
value
temp
open
selected
```

jika context-nya menjadi ambigu.

---

## 10. Mutation Usage

Container cukup menggunakan API hook seperti:

```ts
const createModule = useCreateModule();
```

Kemudian:

```ts
const handleCreateModule = () => {
  createModule.mutate(formCreateModule);
};
```

Jangan menduplikasi logic seperti:

* toast
* invalidate query
* query cache handling
* API service call

di container jika logic tersebut sudah ditangani hook.

---

## 11. Jangan Overengineering

Refactor ini bukan untuk membuat abstraction sebanyak mungkin.

Hindari:

* wrapper yang tidak diperlukan,
* custom hook hanya untuk 2-3 baris state sederhana,
* type duplikat,
* interface berlapis-lapis,
* helper yang hanya dipakai satu kali tanpa manfaat readability,
* file baru yang tidak diperlukan.

Utamakan:

```txt
simple
explicit
typed
consistent
maintainable
```

---

## 12. Yang Harus Kamu Kerjakan

Analisis semua file yang saya tag.

Kemudian:

1. Identifikasi penulisan yang tidak mengikuti architecture di atas.
2. Identifikasi inline props type.
3. Identifikasi penggunaan setter langsung yang seharusnya diganti handler.
4. Identifikasi state yang seharusnya berada di `_container`.
5. Identifikasi API/query/mutation logic yang berada di presentational component.
6. Cari existing request/response/domain type sebelum membuat type baru.
7. Refactor props agar typed dan terstruktur.
8. Rapikan naming state, handler, props, type, dan function.
9. Pastikan tidak ada perubahan behavior aplikasi.
10. Pastikan TypeScript tetap strict dan tidak menggunakan `any`.
11. Pastikan import yang tidak lagi digunakan dihapus.
12. Jangan mengubah UI/design kecuali diperlukan untuk refactor code.
13. Jangan mengubah API contract/backend contract.
14. Jangan membuat abstraction baru jika tidak memberikan manfaat nyata.

Sebelum melakukan perubahan, pahami dependency antar file yang saya tag agar refactor tidak merusak flow yang sudah berjalan.

Setelah refactor, pastikan pattern akhirnya kurang lebih menjadi:

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
       ├── onChange
       ├── onSubmit
       └── UI state only
              ↓
         Molecules / Atoms
```

PENTING:

Jangan sekadar menjalankan formatter atau mengubah indentasi.

Saya ingin kamu melakukan **architectural code cleanup** berdasarkan pattern yang sudah ada di codebase.

Existing code yang sudah mengikuti pattern project harus dijadikan referensi utama. Jangan menciptakan pattern baru yang bertentangan dengan existing architecture.
