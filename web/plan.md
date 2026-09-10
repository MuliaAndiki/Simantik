# Frontend Service Architecture Implementation Plan

## 1. Objective

Membangun arsitektur service layer frontend yang terstruktur, scalable, type-safe, dan konsisten untuk seluruh endpoint Backend API.

Seluruh komunikasi frontend dengan Backend API **tidak boleh dilakukan langsung dari component/page**.

Architecture yang digunakan:

```text
Component / Page
       │
       ▼
     useApi()
       │
       ├── auth
       ├── user
       ├── plan
       ├── ...
       │
       ▼
   Module Facade
   useAuth()
       │
       ├── query
       └── mutate
       │
       ▼
 TanStack Query Hooks
       │
       ▼
 Service Class
 AuthService
       │
       ▼
 EndpointEntry
       │
       ▼
 API Client
       │
       ▼
 Backend API
```

---

# 2. Architectural Principles

## 2.1 Component tidak boleh memanggil HTTP client secara langsung

Tidak diperbolehkan:

```ts
axios.get("/api/users");
```

atau:

```ts
Api().client.PublicGetResponse(...);
```

di dalam component.

Component hanya boleh menggunakan:

```ts
const api = useApi();

const { data } = api.user.query.me();
```

atau:

```ts
const login = api.auth.mutate.login();
```

---

## 2.2 Endpoint harus centralized

Semua endpoint Backend harus didefinisikan melalui:

```text
configs/
└── endpoints/
    ├── EndpointEntry.ts
    └── state/
        ├── AuthEndpoint.ts
        ├── UserEndpoint.ts
        ├── PlanEndpoint.ts
        └── ...
```

Contoh:

```ts
import { AuthEndpoint } from "./state/AuthEndpoint";
import { UserEndpoint } from "./state/UserEndpoint";

export const EndpointEntry = {
  auth: AuthEndpoint,
  user: UserEndpoint,
};
```

---

# 3. Endpoint Structure

Setiap module memiliki file endpoint sendiri.

Contoh:

```ts
export const AuthEndpoint = {
  login: "/auth/login",
  register: "/auth/register",
  refreshToken: "/auth/refresh",
  logout: "/auth/logout",
};
```

Rules:

- Endpoint tidak boleh ditulis langsung di Service.
- Endpoint harus berasal dari `EndpointEntry`.
- Nama endpoint harus mengikuti nama endpoint Backend.
- Hindari duplikasi URL.
- Dynamic parameter menggunakan function jika diperlukan.

Contoh:

```ts
export const UserEndpoint = {
  me: "/users/me",

  detail: (id: string) => `/users/${id}`,

  update: (id: string) => `/users/${id}`,
};
```

---

# 4. Service Layer

Setiap domain/module memiliki Service Class.

Structure:

```text
services/
├── api/
│   ├── AuthService.ts
│   ├── UserService.ts
│   ├── PlanService.ts
│   └── ...
└── index.ts
```

Contoh:

```ts
import { Api } from "@/api/api-entry";
import { EndpointEntry } from "@/configs/endpoints/EndpointEntry";
import { toServiceResponse } from "@/utils/service.respone";

const { client, server } = Api();

class AuthService {
  public async LoginService(
    payload: LoginRequest,
  ): Promise<TResponse<AuthResponse>> {
    const res = await server.PublicPostResponse<AuthResponse>(
      EndpointEntry.auth.login,
      payload,
    );

    return toServiceResponse(res, {
      message: res.message,
      statusCode: 200,
    });
  }
}

export default new AuthService();
```

---

# 5. Service Responsibilities

Service hanya bertanggung jawab terhadap:

1. Memanggil endpoint.
2. Mengirim request payload.
3. Menentukan HTTP method.
4. Menentukan request/response type.
5. Normalisasi response menggunakan `toServiceResponse`.

Service **tidak boleh** menangani:

- UI state.
- Toast.
- Redirect.
- Modal.
- Form state.
- TanStack Query cache.
- Business logic frontend.

Contoh yang benar:

```ts
class UserService {
  public async GetMe(): Promise<TResponse<UserResponse>> {
    const res = await server.PrivateGetResponse<UserResponse>(
      EndpointEntry.user.me,
    );

    return toServiceResponse(res, {
      message: res.message,
    });
  }
}
```

---

# 6. API Registry

Seluruh Service harus didaftarkan pada satu API registry.

Contoh:

```ts
import { WrapApi } from "@/utils/wrapApi";

import AuthService from "./api/AuthService";
import UserService from "./api/UserService";
import PlanService from "./api/PlanService";

class Api {
  auth = WrapApi(AuthService);
  user = WrapApi(UserService);
  plan = WrapApi(PlanService);
}

export default Api;
```

Tujuan:

- Service mempunyai interface yang konsisten.
- Service dapat digunakan oleh layer TanStack Query.
- Tidak ada import service yang tersebar tanpa struktur.

---

# 7. TanStack Query Layer

Setiap module memiliki:

```text
hooks/
├── auth/
│   ├── state/
│   │   ├── mutate.ts
│   │   └── query.ts
│   └── useAuth.ts
│
├── user/
│   ├── state/
│   │   ├── mutate.ts
│   │   └── query.ts
│   └── useUser.ts
│
└── plan/
    ├── state/
    │   ├── mutate.ts
    │   └── query.ts
    └── usePlan.ts
```

---

# 8. Query Hooks

Query digunakan untuk endpoint yang mengambil data.

Contoh:

```ts
export function useMe() {
  return useQuery({
    queryKey: queryKey.user.me(),
    queryFn: () => UserService.GetMe(),
  });
}
```

Query hook bertanggung jawab terhadap:

- `queryKey`
- `queryFn`
- cache
- stale time
- enabled
- invalidation
- retry
- transform data jika diperlukan

---

# 9. Mutation Hooks

Mutation digunakan untuk:

- POST
- PUT
- PATCH
- DELETE
- action endpoint

Contoh:

```ts
export function useUpdateProfile() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      UserService.UpdateProfile(payload),

    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: "success",
      });

      ns.queryClient.invalidateQueries({
        queryKey: queryKey.user.root(),
      });
    },

    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: "error",
      });
    },
  });
}
```

---

# 10. Query Key Architecture

Setiap module harus mempunyai query key sendiri.

Contoh:

```ts
export const userQueryKey = {
  root: () => ["user"] as const,

  me: () => [...userQueryKey.root(), "me"] as const,

  detail: (id: string) => [...userQueryKey.root(), "detail", id] as const,

  list: (params: UserListParams) =>
    [...userQueryKey.root(), "list", params] as const,
};
```

Rules:

```text
root
 ├── me
 ├── detail
 ├── list
 └── ...
```

Jangan menggunakan string query key secara langsung di component.

Tidak:

```ts
["users", "me"];
```

Gunakan:

```ts
queryKey.user.me();
```

---

# 11. Module Facade

Setiap domain memiliki facade.

Contoh:

```ts
export const useUser = () => {
  return {
    query: {
      me: useMe,
      detail: useUserDetail,
      list: useUsers,
    },

    mutate: {
      updateProfile: useUpdateProfile,
      changePassword: useChangePassword,
      deleteAccount: useDeleteAccount,
    },
  };
};
```

Facade:

- Tidak memiliki business logic.
- Tidak melakukan API request sendiri.
- Hanya melakukan grouping query dan mutation hooks.

---

# 12. Global API Facade

Semua module digabungkan melalui:

```ts
export function useApi() {
  return {
    auth: useAuth(),
    user: useUser(),
    plan: usePlan(),
    dashboard: useDashboard(),
  };
}
```

Dengan demikian component memiliki single entry point.

Contoh:

```ts
const api = useApi();

const { data } = api.user.query.me();

const createPlan = api.plan.mutate.create();
```

---

# 13. Recommended Folder Structure

Final structure:

```text
src/
│
├── api/
│   └── api-entry.ts
│
├── configs/
│   └── endpoints/
│       ├── EndpointEntry.ts
│       │
│       └── state/
│           ├── AuthEndpoint.ts
│           ├── UserEndpoint.ts
│           ├── PlanEndpoint.ts
│           ├── DashboardEndpoint.ts
│           └── ...
│
├── services/
│   └── api/
│       ├── AuthService.ts
│       ├── UserService.ts
│       ├── PlanService.ts
│       ├── DashboardService.ts
│       └── ...
│
├── hooks/
│   ├── auth/
│   │   ├── state/
│   │   │   ├── mutate.ts
│   │   │   └── query.ts
│   │   └── useAuth.ts
│   │
│   ├── user/
│   │   ├── state/
│   │   │   ├── mutate.ts
│   │   │   └── query.ts
│   │   └── useUser.ts
│   │
│   ├── plan/
│   │   ├── state/
│   │   │   ├── mutate.ts
│   │   │   └── query.ts
│   │   └── usePlan.ts
│   │
│   └── useApi.ts
│
├── types/
│   └── service/
│       ├── auth.ts
│       ├── user.ts
│       ├── plan.ts
│       └── ...
│
└── utils/
    ├── wrapApi.ts
    └── service.respone.ts
```

---

# 14. Endpoint Inventory

Sebelum implementasi coding, seluruh Backend API harus di-inventory terlebih dahulu.

Buat tabel:

| Module | Method | Endpoint         | Auth    | Request           | Response         | Query/Mutation |
| ------ | ------ | ---------------- | ------- | ----------------- | ---------------- | -------------- |
| Auth   | POST   | `/auth/login`    | Public  | LoginRequest      | AuthResponse     | Mutation       |
| Auth   | POST   | `/auth/register` | Public  | RegisterRequest   | RegisterResponse | Mutation       |
| Auth   | POST   | `/auth/refresh`  | Public  | RefreshRequest    | AuthResponse     | Mutation       |
| User   | GET    | `/users/me`      | Private | -                 | UserResponse     | Query          |
| Plan   | GET    | `/plans`         | Private | QueryParams       | PlanListResponse | Query          |
| Plan   | POST   | `/plans`         | Private | CreatePlanRequest | PlanResponse     | Mutation       |

**Jangan membuat service berdasarkan asumsi endpoint.**

Endpoint harus berasal dari Backend API yang benar-benar tersedia.

---

# 15. Implementation Order

Implementasi dilakukan secara bertahap.

## Phase 1 — Architecture Foundation

Buat:

```text
EndpointEntry
Api registry
Service base pattern
Response normalization
Query key pattern
useApi()
```

Acceptance criteria:

- Struktur folder sudah tersedia.
- Pattern endpoint konsisten.
- Service dapat digunakan.
- `useApi()` dapat menjadi single entry point.

---

## Phase 2 — Auth

Implement:

```text
AuthEndpoint
AuthService
Auth query hooks
Auth mutation hooks
useAuth()
```

Endpoint minimal:

```text
register
login
refresh token
logout
me
```

Tambahkan endpoint auth lain jika tersedia di Backend.

Acceptance:

```ts
const api = useApi();

api.auth.mutate.login();
api.auth.mutate.register();
api.auth.mutate.logout();

api.auth.query.me();
```

---

## Phase 3 — User

Implement:

```text
UserEndpoint
UserService
User query hooks
User mutation hooks
useUser()
```

Contoh:

```ts
api.user.query.me();
api.user.query.detail();
api.user.mutate.updateProfile();
```

---

## Phase 4 — Core Business Modules

Implement module berdasarkan domain Backend.

Contoh:

```text
Plan
Phase
Task
Project
Dashboard
Notification
```

Setiap module harus memiliki:

```text
Endpoint
Service
Query
Mutation
Facade
```

---

## Phase 5 — Supporting Modules

Implement:

```text
File
Upload
Notification
Settings
etc.
```

---

## Phase 6 — Global Integration

Pastikan seluruh module terdaftar:

```ts
export function useApi() {
  return {
    auth: useAuth(),
    user: useUser(),
    plan: usePlan(),
    phase: usePhase(),
    task: useTask(),
    dashboard: useDashboard(),
    notification: useNotification(),
  };
}
```

---

# 16. Naming Convention

## Endpoint

```text
AuthEndpoint
UserEndpoint
PlanEndpoint
```

## Service

```text
AuthService
UserService
PlanService
```

## Query

```text
useMe
useUserDetail
useUsers
```

## Mutation

```text
useLogin
useRegister
useCreatePlan
useUpdatePlan
useDeletePlan
```

## Service Method

Gunakan nama yang eksplisit:

```ts
LoginService();
RegisterService();
GetMeService();
CreatePlanService();
UpdatePlanService();
DeletePlanService();
```

atau gunakan convention yang sudah dipakai project secara konsisten.

---

# 17. HTTP Method Convention

Mapping:

```text
GET     → Query
POST    → Mutation
PUT     → Mutation
PATCH   → Mutation
DELETE  → Mutation
```

Exception diperbolehkan untuk endpoint action tertentu, tetapi harus mengikuti behavior Backend.

---

# 18. Authentication Convention

Endpoint harus dibedakan berdasarkan kebutuhan authentication.

Contoh:

```ts
client.PublicPostResponse(...)
```

untuk endpoint public.

Contoh:

```ts
server.PrivateGetResponse(...)
```

untuk endpoint yang membutuhkan authentication.

Jangan menambahkan authentication handling di setiap component.

Authentication harus menjadi tanggung jawab API/client layer.

---

# 19. Type Safety

Setiap endpoint harus mempunyai request dan response type.

Contoh:

```ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
```

Service:

```ts
public async LoginService(
  payload: LoginRequest
): Promise<TResponse<AuthResponse>>
```

Hindari:

```ts
any;
```

Hindari juga response type generik yang tidak merepresentasikan response Backend.

---

# 20. Error Handling

Error dari Backend harus dinormalisasi melalui API/service layer.

Component tidak boleh melakukan parsing error HTTP secara manual.

Tidak:

```ts
try {
  ...
} catch (error: any) {
  if (error.response?.data?.message) {
    ...
  }
}
```

Gunakan:

```ts
onError: (err) => {
  ns.alert.toast({
    title: ResponseTitles.error,
    message: err.message,
    icon: "error",
  });
};
```

---

# 21. Cache Invalidation

Mutation harus melakukan invalidation terhadap query yang relevan.

Contoh:

```ts
useUpdateProfile();
```

setelah sukses:

```ts
queryClient.invalidateQueries({
  queryKey: queryKey.user.root(),
});
```

Untuk mutation yang mempengaruhi module lain, invalidate query module terkait.

Contoh:

```text
CreatePlan
   ↓
invalidate plan.root
invalidate dashboard.root
```

---

# 22. Optimistic Update

Gunakan optimistic update hanya jika diperlukan.

Pattern:

```ts
onMutate
→ cancelQueries
→ snapshot
→ update cache
→ onError rollback
→ onSettled invalidate
```

Jangan menggunakan optimistic update untuk semua mutation secara otomatis.

Gunakan hanya ketika UX membutuhkan perubahan UI instan.

---

# 23. API Layer Rules

### Rule 1

Component hanya menggunakan:

```ts
useApi();
```

### Rule 2

Facade hanya melakukan grouping:

```ts
useAuth();
useUser();
usePlan();
```

### Rule 3

TanStack Query hanya berada di hook layer.

### Rule 4

HTTP request hanya berada di Service layer/API layer.

### Rule 5

Endpoint URL hanya berada di Endpoint layer.

### Rule 6

Request/response type berada di type layer.

### Rule 7

Business logic tidak boleh masuk ke Endpoint.

### Rule 8

Business logic API tidak boleh masuk ke Component.

---

# 24. Example Complete Flow

Untuk endpoint:

```http
POST /plans
```

Implementasi:

### 1. Endpoint

```ts
export const PlanEndpoint = {
  create: "/plans",
};
```

### 2. EndpointEntry

```ts
export const EndpointEntry = {
  plan: PlanEndpoint,
};
```

### 3. Type

```ts
export interface CreatePlanRequest {
  name: string;
  description?: string;
}

export interface PlanResponse {
  id: string;
  name: string;
  description?: string;
}
```

### 4. Service

```ts
class PlanService {
  public async CreatePlanService(
    payload: CreatePlanRequest,
  ): Promise<TResponse<PlanResponse>> {
    const res = await server.PrivatePostResponse<PlanResponse>(
      EndpointEntry.plan.create,
      payload,
    );

    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new PlanService();
```

### 5. API Registry

```ts
class Api {
  plan = WrapApi(PlanService);
}
```

### 6. Mutation

```ts
export function useCreatePlan() {
  return useMutation({
    mutationFn: (payload: CreatePlanRequest) =>
      PlanService.CreatePlanService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.plan.root(),
      });
    },
  });
}
```

### 7. Facade

```ts
export const usePlan = () => {
  return {
    query: {
      list: usePlans,
    },

    mutate: {
      create: useCreatePlan,
    },
  };
};
```

### 8. Global Entry

```ts
export function useApi() {
  return {
    auth: useAuth(),
    user: useUser(),
    plan: usePlan(),
  };
}
```

### 9. Component

```tsx
const api = useApi();

const createPlan = api.plan.mutate.create();

createPlan.mutate({
  name: "My Plan",
  description: "Plan description",
});
```

Component tidak mengetahui:

```text
URL
HTTP client
axios/fetch
request normalization
response normalization
query key
cache implementation
```

Component hanya mengetahui API facade.

---

# 25. Development Checklist

Setiap module dianggap selesai apabila:

- [ ] Semua endpoint Backend sudah diidentifikasi.
- [ ] Endpoint file sudah dibuat.
- [ ] Endpoint sudah masuk `EndpointEntry`.
- [ ] Request type sudah dibuat.
- [ ] Response type sudah dibuat.
- [ ] Service sudah dibuat.
- [ ] Service sudah menggunakan `EndpointEntry`.
- [ ] Service sudah menggunakan API client yang benar.
- [ ] Response sudah menggunakan `toServiceResponse`.
- [ ] Service sudah masuk API registry.
- [ ] Query hooks sudah dibuat.
- [ ] Mutation hooks sudah dibuat.
- [ ] Query keys sudah dibuat.
- [ ] Facade module sudah dibuat.
- [ ] Facade sudah masuk `useApi()`.
- [ ] Error handling sudah tersedia.
- [ ] Success handling sudah tersedia.
- [ ] Cache invalidation sudah sesuai.
- [ ] Tidak ada direct API call dari component.
- [ ] Tidak ada hardcoded endpoint di component.
- [ ] Tidak menggunakan `any` tanpa alasan.
- [ ] TypeScript berhasil build.
- [ ] Lint berhasil.
- [ ] Endpoint sudah diuji terhadap Backend.

---

# 26. Final Architecture

Target akhir:

```text
                    ┌─────────────────────┐
                    │     COMPONENT       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       useApi()      │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
      useAuth()            useUser()            usePlan()
          │                    │                    │
     ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
     │         │          │         │          │         │
   query     mutate     query     mutate     query     mutate
     │         │          │         │          │         │
     └────┬────┘          └────┬────┘          └────┬────┘
          │                    │                    │
          ▼                    ▼                    ▼
      TanStack             TanStack             TanStack
       Query                Query                Query
          │                    │                    │
          ▼                    ▼                    ▼
     AuthService          UserService          PlanService
          │                    │                    │
          ▼                    ▼                    ▼
     AuthEndpoint          UserEndpoint         PlanEndpoint
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ▼
                         EndpointEntry
                               │
                               ▼
                         API Client
                               │
                               ▼
                         Backend API
```

---

# 27. Definition of Done

Service architecture dinyatakan selesai apabila frontend dapat mengakses seluruh Backend API melalui pola:

```ts
const api = useApi();
```

dengan interface:

```ts
api.<module>.query.<action>()
```

dan:

```ts
api.<module>.mutate.<action>()
```

tanpa component melakukan HTTP request secara langsung.

Contoh final:

```ts
const api = useApi();

const { data: me } = api.auth.query.me();

const { data: plans } = api.plan.query.list();

const createPlan = api.plan.mutate.create();

const updateProfile = api.user.mutate.updateProfile();
```

Arsitektur harus tetap konsisten ketika jumlah module bertambah dari 5 menjadi 20+ module.
