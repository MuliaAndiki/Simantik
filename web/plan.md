# Auth Page Integration Plan

## 1. Objective

Mengintegrasikan seluruh halaman authentication pada frontend SIMANTIK dengan backend Auth Module yang sudah tersedia.

Auth page yang harus diintegrasikan:

- Login
- Register
- Forgot Password
- Verify OTP
- Reset Password
- Login Google

Integrasi harus mengikuti arsitektur frontend existing project yang menggunakan **Atomic Design**:

````text
src/components/
├── atoms/
├── molecules/
├── organisms/
├── page/
├── pwa/
├── templates/
└── wrapper/

Architecture principle:

Page
  ↓
Container
  ↓
Atomic Design UI
  ↓
API Service
  ↓
Backend
2. Existing Architecture Rules
2.1 Atomic Design

Frontend menggunakan Atomic Design sebagai struktur utama component.

atoms
  ↓
molecules
  ↓
organisms
  ↓
templates
  ↓
page
Atoms

Component UI paling kecil.

Contoh:

Button
Input
Label
Checkbox
Icon
Typography
Spinner

Responsibilities:

Pure presentation
Menerima data melalui props
Menerima event handler melalui props
Tidak melakukan API request
Tidak menggunakan TanStack Query
Tidak menggunakan router
Tidak memiliki business logic
Molecules

Gabungan beberapa atoms.

Contoh:

FormField
PasswordField
OtpInput
SocialLoginButton

Responsibilities:

Presentation
Composition dari atoms
Menerima data melalui props
Menerima callback melalui props

Tidak boleh:

API request
TanStack Query
Router
Authentication logic
Business logic
Organisms

Component UI yang lebih kompleks.

Contoh:

LoginForm
RegisterForm
ForgotPasswordForm
VerifyOtpForm
ResetPasswordForm

Responsibilities:

Menyusun molecules dan atoms
Menampilkan form
Menampilkan validation error
Menampilkan loading state
Menerima semua state dan handler dari Container

Organism tidak boleh:

'use client'

useMutation()
useQuery()
useRouter()
fetch()
axios()
authService.login()

Semua logic tersebut berada di Container.

Templates

Template bertanggung jawab terhadap layout dan struktur visual halaman.

Contoh:

AuthTemplate
DashboardTemplate

Template tidak boleh mengandung authentication business logic.

Page

Page component bertanggung jawab terhadap composition halaman.

Page harus tetap tipis.

Contoh:

import { LoginContainer } from '@/containers/auth/LoginContainer'

export default function LoginPage() {
  return <LoginContainer />
}

Page tidak melakukan API request.

3. Container Architecture

Container adalah satu-satunya layer yang boleh menggunakan 'use client' untuk authentication flow.

Contoh:

'use client'

export function LoginContainer() {
  // state
  // mutation
  // API
  // handler
  // redirect

  return (
    <LoginPage
      ...
    />
  )
}

Container bertanggung jawab terhadap:

Client state
Form state
API request
TanStack Query mutation/query
Authentication flow
Loading state
Error handling
Success handling
Redirect
Navigation
Token/session handling sesuai existing auth architecture
Event handler
Business flow
4. STRICT use client Rule
4.1 Allowed

Hanya Container:

'use client'

Contoh:

LoginContainer.tsx
RegisterContainer.tsx
ForgotPasswordContainer.tsx
VerifyOtpContainer.tsx
ResetPasswordContainer.tsx
4.2 Forbidden

Jangan menambahkan:

'use client'

ke:

atoms/
molecules/
organisms/
templates/
page/
wrapper/

kecuali terdapat kebutuhan framework yang benar-benar tidak dapat dihindari dan sudah disetujui secara eksplisit.

Untuk authentication implementation ini, target architecture adalah:

Container = Client
UI Components = Server-compatible / presentational
5. Callback / Function Propagation Rule

Semua function dari Container yang dibutuhkan UI WAJIB diteruskan melalui props.

Tidak boleh menggunakan:

Context hanya untuk menghindari prop drilling
Global event
Hidden callback
Internal API call dari component
State management tersembunyi di organism
Service call langsung dari organism

Contoh yang benar:

LoginContainer
      │
      │ onSubmit
      ▼
LoginPage
      │
      │ onSubmit
      ▼
LoginForm
      │
      │ onSubmit
      ▼
Form

Jika callback hanya digunakan oleh molecule:

LoginContainer
      │
      │ onEmailChange
      ▼
LoginForm
      │
      │ onEmailChange
      ▼
EmailField
      │
      │ onChange
      ▼
Input

Semua harus eksplisit melalui props.

6. Data Flow

Architecture:

User Interaction
      ↓
Atomic Component
      ↓
Callback via props
      ↓
Organism
      ↓
Page
      ↓
Container
      ↓
Service/API
      ↓
Backend

Response:

Backend
   ↓
API Service
   ↓
Container
   ↓
State
   ↓
Props
   ↓
Organism
   ↓
Molecule
   ↓
Atom

Tidak boleh terjadi:

Atom → API
Molecule → API
Organism → API
Template → API
Page → API
7. Authentication Endpoints

Backend Auth Module sudah menyediakan endpoint:

POST /login
POST /register
POST /forgotPassword
POST /verifyOtp/
POST /resetPassword
POST /loginGoogle

Gunakan endpoint existing.

Jangan membuat endpoint baru tanpa kebutuhan yang jelas.

Jangan mengubah kontrak backend hanya untuk menyesuaikan frontend.

8. Auth Service

Semua komunikasi HTTP authentication harus melalui service/API abstraction yang sudah digunakan project.

Contoh:

src/
└── services/
    └── auth/
        └── auth.service.ts

Atau gunakan struktur existing project apabila sudah tersedia.

Contoh interface:

authService.login()
authService.register()
authService.forgotPassword()
authService.verifyOtp()
authService.resetPassword()
authService.loginGoogle()

Container tidak boleh membuat HTTP client baru.

Jangan membuat:

axios.post(...)

langsung di component jika project sudah memiliki API abstraction.

9. Auth Page Structure

Gunakan Atomic Design existing project.

Recommended structure:

src/
├── app/
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       ├── forgot-password/
│       │   └── page.tsx
│       ├── verify-otp/
│       │   └── page.tsx
│       └── reset-password/
│           └── page.tsx
│
├── containers/
│   └── auth/
│       ├── LoginContainer.tsx
│       ├── RegisterContainer.tsx
│       ├── ForgotPasswordContainer.tsx
│       ├── VerifyOtpContainer.tsx
│       └── ResetPasswordContainer.tsx
│
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ForgotPasswordForm.tsx
│   │       ├── VerifyOtpForm.tsx
│   │       └── ResetPasswordForm.tsx
│   │
│   ├── page/
│   │   └── auth/
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       ├── ForgotPasswordPage.tsx
│   │       ├── VerifyOtpPage.tsx
│   │       └── ResetPasswordPage.tsx
│   │
│   ├── templates/
│   │   └── auth/
│   │       └── AuthTemplate.tsx
│   │
│   ├── pwa/
│   └── wrapper/
│
├── services/
├── queries/
├── schemas/
└── types/
Important

Sebelum membuat folder/file baru:

Inspect existing project.
Cari Container architecture yang sudah digunakan.
Cari existing auth component.
Cari existing API service.
Cari existing query/mutation abstraction.
Cari existing Atomic Design components.
Reuse existing components jika tersedia.

Jangan membuat duplicate component.

Jika project memiliki struktur berbeda tetapi masih mengikuti prinsip yang sama, ikuti struktur existing project.

10. Login Flow
10.1 Architecture
/app/(auth)/login/page.tsx
          ↓
LoginContainer
          ↓
LoginPage
          ↓
AuthTemplate
          ↓
LoginForm
          ↓
Molecules
          ↓
Atoms
10.2 Container Responsibilities

LoginContainer menangani:

Email state
Password state
Validation
Login mutation
Loading state
Error state
Success state
Google login flow
Redirect setelah login

Contoh:

'use client'

export function LoginContainer() {
  const handleSubmit = async (data: LoginFormData) => {
    // call auth service
  }

  const handleGoogleLogin = () => {
    // google login flow
  }

  return (
    <LoginPage
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      ...
    />
  )
}
11. Register Flow

Flow:

Register Page
      ↓
RegisterContainer
      ↓
RegisterPage
      ↓
AuthTemplate
      ↓
RegisterForm
      ↓
Molecules
      ↓
Atoms

Container menangani:

Form state
Validation
Register API
Loading
Error
Success
Redirect/navigation

UI hanya menerima:

<RegisterForm
  values={values}
  errors={errors}
  loading={loading}
  onSubmit={handleSubmit}
  onChange={handleChange}
/>
12. Forgot Password Flow

Flow:

Forgot Password
      ↓
ForgotPasswordContainer
      ↓
ForgotPasswordPage
      ↓
ForgotPasswordForm

Container:

Input Email
    ↓
POST /forgotPassword
    ↓
OTP Sent
    ↓
Navigate Verify OTP

Handler:

onSubmit

harus berasal dari Container.

13. Verify OTP Flow

Flow:

Verify OTP
      ↓
VerifyOtpContainer
      ↓
VerifyOtpPage
      ↓
VerifyOtpForm
      ↓
OtpInput

Container menangani:

OTP state
Email/reference state sesuai existing flow
Verify OTP API
Error handling
Loading
Success
Navigation ke reset password

Contoh:

<VerifyOtpForm
  otp={otp}
  loading={loading}
  error={error}
  onOtpChange={handleOtpChange}
  onSubmit={handleSubmit}
/>
14. Reset Password Flow

Flow:

Reset Password
      ↓
ResetPasswordContainer
      ↓
ResetPasswordPage
      ↓
ResetPasswordForm

Container menangani:

Password
Confirm password
Validation
Reset password API
Loading
Error
Success
Redirect ke login

UI tidak mengetahui bagaimana API reset password bekerja.

15. Google Login

Google Login harus mengikuti endpoint existing:

POST /loginGoogle

Namun sebelum implementasi:

Inspect existing backend contract.
Inspect response structure.
Inspect existing authentication/session handling.
Inspect apakah endpoint menerima credential/token/code.
Ikuti kontrak existing.

Jangan mengasumsikan payload Google Login.

16. Form Validation

Validation dibagi menjadi dua:

Frontend Validation
        ↓
UX validation
        ↓
Backend Validation
        ↓
Authoritative validation

Frontend digunakan untuk:

Required field
Format email
Password confirmation
OTP length/format
Immediate feedback

Backend tetap menjadi source of truth.

Schema validation sebaiknya dipisahkan:

schemas/
└── auth/
    └── auth.schema.ts

Contoh:

loginSchema
registerSchema
forgotPasswordSchema
verifyOtpSchema
resetPasswordSchema

Gunakan validation library yang sudah digunakan project.

Jangan menambahkan library baru jika tidak diperlukan.

17. TanStack Query

Jika project sudah menggunakan TanStack Query:

Gunakan TanStack Query pada Container atau abstraction yang dipanggil oleh Container.

Contoh:

LoginContainer
      ↓
useLoginMutation()
      ↓
authService.login()
      ↓
API

Jangan:

LoginForm
      ↓
useMutation()

Organism tetap presentational.

18. Error Handling

Error API harus dinormalisasi pada layer API/service/query atau Container.

UI menerima error yang sudah siap ditampilkan.

Contoh:

<LoginForm
  error={error}
  ...
/>

Jangan membuat UI memahami struktur error backend.

Tidak boleh:

if (error.response.data.code === ...)

di Atom/Molecule/Organism.

19. Loading State

Loading berasal dari Container.

Contoh:

<LoginForm
  loading={isPending}
  onSubmit={handleSubmit}
/>

Organism hanya menampilkan:

loading = true
    ↓
disable submit
    ↓
show loading indicator

Organism tidak menentukan kapan loading dimulai atau selesai.

20. Success State

Success flow ditangani Container.

Contoh:

Login Success
     ↓
Container
     ↓
Update auth state
     ↓
Redirect

Bukan:

LoginForm
     ↓
router.push(...)
21. Routing

Semua routing authentication dilakukan dari Container.

Contoh:

const router = useRouter()

const handleLogin = async (...) => {
  await login(...)
  router.push('/dashboard')
}

Jangan menggunakan:

useRouter()

di:

atoms
molecules
organisms
templates
page
22. Props Contract

Setiap component harus memiliki props yang eksplisit.

Contoh:

interface LoginFormProps {
  email: string
  password: string
  errors?: LoginFormErrors
  loading?: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  onGoogleLogin: () => void
}

Kemudian:

Container
   ↓
LoginForm

Semua function dikirim melalui props.

23. No Hidden Business Logic

Jangan membuat logic authentication tersembunyi di component.

Forbidden:

// LoginForm.tsx

const handleLogin = async () => {
  await authService.login(...)
}

Forbidden:

// LoginForm.tsx

const mutation = useMutation(...)

Forbidden:

// LoginForm.tsx

const router = useRouter()

Forbidden:

// Button.tsx

if (userAuthenticated) {
  ...
}

Authentication decision harus berada pada Container/application layer.

24. Atomic Component Reuse

Sebelum membuat component baru:

1. Search atoms existing
2. Search molecules existing
3. Search organisms existing
4. Search templates existing
5. Reuse jika tersedia

Contoh:

Jika sudah ada:

Input
PasswordInput
Button
FormLabel
FormError

jangan membuat:

AuthInput
LoginInput
RegisterInput

tanpa alasan yang kuat.

25. Authentication Flow
Login
User
 ↓
Login Form
 ↓
Container
 ↓
POST /login
 ↓
Auth Response
 ↓
Store/Update Auth State
 ↓
Redirect
Register
User
 ↓
Register Form
 ↓
Container
 ↓
POST /register
 ↓
Success
 ↓
Redirect sesuai existing product flow
Forgot Password
User
 ↓
Forgot Password Form
 ↓
Container
 ↓
POST /forgotPassword
 ↓
OTP Sent
 ↓
Verify OTP
Verify OTP
User
 ↓
OTP Form
 ↓
Container
 ↓
POST /verifyOtp/
 ↓
OTP Valid
 ↓
Reset Password
Reset Password
User
 ↓
Reset Password Form
 ↓
Container
 ↓
POST /resetPassword
 ↓
Success
 ↓
Login
26. Security Rules

Jangan melakukan logging terhadap:

password
confirmPassword
OTP
accessToken
refreshToken
Google credential

Jangan menyimpan sensitive data di UI component.

Backend tetap menjadi authority untuk authentication.

27. Implementation Phases
Phase 1 — Project Inspection

Inspect:

src/app
src/components
src/containers
src/services
src/api
src/hooks
src/providers
src/lib
src/types
src/schemas

Cari:

Existing Atomic Design structure
Existing auth components
Existing API client
Existing query hooks
Existing auth state
Existing routing conventions
Existing form validation
Existing error handling

Output:

Architecture Map
Existing Components
Existing Services
Existing Auth Flow
Phase 2 — Auth API Integration

Implement/reuse:

login
register
forgotPassword
verifyOtp
resetPassword
loginGoogle

Pastikan:

Request payload sesuai backend
Response type sesuai backend
Error handling konsisten
Tidak ada duplicate API client
Phase 3 — Login

Implement:

LoginContainer
LoginPage
LoginForm integration
Google Login

Acceptance:

[ ] Login berhasil
[ ] Invalid credential ditampilkan
[ ] Loading state bekerja
[ ] Button disabled saat request
[ ] Success redirect bekerja
[ ] Google login bekerja sesuai backend contract
[ ] Tidak ada API call dari UI component
Phase 4 — Register

Implement:

RegisterContainer
RegisterPage
RegisterForm integration

Acceptance:

[ ] Register berhasil
[ ] Validation bekerja
[ ] Backend error ditampilkan
[ ] Loading state bekerja
[ ] Success flow bekerja
Phase 5 — Forgot Password

Implement:

ForgotPasswordContainer
ForgotPasswordPage
ForgotPasswordForm

Acceptance:

[ ] Email validation
[ ] API request
[ ] Loading
[ ] Error
[ ] Success
[ ] Navigate to OTP
Phase 6 — Verify OTP

Implement:

VerifyOtpContainer
VerifyOtpPage
VerifyOtpForm

Acceptance:

[ ] OTP input bekerja
[ ] OTP validation
[ ] API request
[ ] Invalid OTP handling
[ ] Loading state
[ ] Success navigation
Phase 7 — Reset Password

Implement:

ResetPasswordContainer
ResetPasswordPage
ResetPasswordForm

Acceptance:

[ ] Password validation
[ ] Confirm password validation
[ ] API request
[ ] Error handling
[ ] Success handling
[ ] Redirect to login
Phase 8 — Integration Testing

Test seluruh flow:

Register
   ↓
Login
   ↓
Authenticated User

dan:

Forgot Password
   ↓
Verify OTP
   ↓
Reset Password
   ↓
Login

Google:

Google Login
   ↓
Authentication
   ↓
Authenticated User
28. Architecture Validation Checklist

Sebelum dianggap selesai, lakukan pemeriksaan:

Client Boundary
[ ] Hanya Container yang menggunakan 'use client'
[ ] Tidak ada 'use client' di atoms
[ ] Tidak ada 'use client' di molecules
[ ] Tidak ada 'use client' di organisms
[ ] Tidak ada 'use client' di templates
[ ] Tidak ada 'use client' di page
API
[ ] Tidak ada API request di atom
[ ] Tidak ada API request di molecule
[ ] Tidak ada API request di organism
[ ] Tidak ada API request di template
[ ] API dipanggil dari Container/service abstraction
Routing
[ ] Tidak ada useRouter di atom
[ ] Tidak ada useRouter di molecule
[ ] Tidak ada useRouter di organism
[ ] Tidak ada useRouter di template
[ ] Routing ditangani Container
Callback
[ ] Semua callback berasal dari Container
[ ] Callback dikirim menggunakan props
[ ] Tidak menggunakan hidden callback
[ ] Tidak membuat Context hanya untuk menghindari prop drilling
[ ] Callback diteruskan sampai component yang membutuhkan
Atomic Design
[ ] Existing atoms digunakan kembali
[ ] Existing molecules digunakan kembali
[ ] Existing organisms digunakan kembali
[ ] Tidak ada duplicate component
[ ] Organism tetap presentational
[ ] Template hanya menangani layout
29. Forbidden Architecture

AI agent DILARANG menghasilkan architecture seperti:

LoginForm
 ├── useMutation
 ├── useRouter
 ├── authService
 └── API

Dilarang:

Atom
 └── API

Dilarang:

Molecule
 └── useQuery

Dilarang:

Organism
 └── useMutation

Dilarang:

Page
 └── API call

Dilarang menggunakan Context hanya untuk menghindari:

Container
 ↓
Page
 ↓
Organism
 ↓
Molecule

Prop drilling memang merupakan bagian dari architecture ini dan harus dilakukan secara eksplisit.

30. Definition of Done

Auth integration dianggap selesai jika:

Architecture
[ ] Atomic Design existing project tetap digunakan
[ ] Tidak merombak struktur project tanpa alasan
[ ] Container menjadi orchestration layer
[ ] UI components bersifat presentational
Client Boundary
[ ] 'use client' hanya di Container
[ ] Tidak ada unnecessary client boundary
API
[ ] Login terintegrasi
[ ] Register terintegrasi
[ ] Forgot Password terintegrasi
[ ] Verify OTP terintegrasi
[ ] Reset Password terintegrasi
[ ] Google Login terintegrasi
UX
[ ] Loading state
[ ] Error state
[ ] Validation state
[ ] Success state
[ ] Disabled state
Security
[ ] Password tidak di-log
[ ] OTP tidak di-log
[ ] Token tidak di-log
[ ] Authentication logic tidak berada di UI component
Code Quality
[ ] Tidak ada duplicate API client
[ ] Tidak ada duplicate Atomic component
[ ] Tidak ada API call di UI component
[ ] Tidak ada routing di UI component
[ ] Semua callback melalui props
[ ] TypeScript types tersedia
[ ] Existing project conventions dipertahankan
31. Final Architecture

Target akhir:

                         APP ROUTE
                            │
                            ▼
                         CONTAINER
                      'use client'
                            │
              ┌─────────────┼─────────────┐
              │             │             │
             State         API          Router
              │             │             │
              └─────────────┼─────────────┘
                            │
                          Props
                            │
                            ▼
                           PAGE
                            │
                          Props
                            ▼
                        TEMPLATE
                            │
                          Props
                            ▼
                        ORGANISM
                            │
                          Props
                            ▼
                        MOLECULE
                            │
                          Props
                            ▼
                           ATOM

API flow:

Container
    ↓
Query / Mutation
    ↓
Auth Service
    ↓
API Client
    ↓
Backend Auth Module

Tidak boleh ada business logic authentication di bawah Container.

Container adalah orchestration layer. Atomic Design components adalah presentation layer. Service/API adalah communication layer. Backend adalah business authority.# Auth Page Integration Plan

## 1. Objective

Mengintegrasikan seluruh halaman authentication pada frontend SIMANTIK dengan backend Auth Module yang sudah tersedia.

Auth page yang harus diintegrasikan:

- Login
- Register
- Forgot Password
- Verify OTP
- Reset Password
- Login Google

Integrasi harus mengikuti arsitektur frontend existing project yang menggunakan **Atomic Design**:

```text
src/components/
├── atoms/
├── molecules/
├── organisms/
├── page/
├── pwa/
├── templates/
└── wrapper/

Architecture principle:

Page
  ↓
Container
  ↓
Atomic Design UI
  ↓
API Service
  ↓
Backend
2. Existing Architecture Rules
2.1 Atomic Design

Frontend menggunakan Atomic Design sebagai struktur utama component.

atoms
  ↓
molecules
  ↓
organisms
  ↓
templates
  ↓
page
Atoms

Component UI paling kecil.

Contoh:

Button
Input
Label
Checkbox
Icon
Typography
Spinner

Responsibilities:

Pure presentation
Menerima data melalui props
Menerima event handler melalui props
Tidak melakukan API request
Tidak menggunakan TanStack Query
Tidak menggunakan router
Tidak memiliki business logic
Molecules

Gabungan beberapa atoms.

Contoh:

FormField
PasswordField
OtpInput
SocialLoginButton

Responsibilities:

Presentation
Composition dari atoms
Menerima data melalui props
Menerima callback melalui props

Tidak boleh:

API request
TanStack Query
Router
Authentication logic
Business logic
Organisms

Component UI yang lebih kompleks.

Contoh:

LoginForm
RegisterForm
ForgotPasswordForm
VerifyOtpForm
ResetPasswordForm

Responsibilities:

Menyusun molecules dan atoms
Menampilkan form
Menampilkan validation error
Menampilkan loading state
Menerima semua state dan handler dari Container

Organism tidak boleh:

'use client'

useMutation()
useQuery()
useRouter()
fetch()
axios()
authService.login()

Semua logic tersebut berada di Container.

Templates

Template bertanggung jawab terhadap layout dan struktur visual halaman.

Contoh:

AuthTemplate
DashboardTemplate

Template tidak boleh mengandung authentication business logic.

Page

Page component bertanggung jawab terhadap composition halaman.

Page harus tetap tipis.

Contoh:

import { LoginContainer } from '@/containers/auth/LoginContainer'

export default function LoginPage() {
  return <LoginContainer />
}

Page tidak melakukan API request.

3. Container Architecture

Container adalah satu-satunya layer yang boleh menggunakan 'use client' untuk authentication flow.

Contoh:

'use client'

export function LoginContainer() {
  // state
  // mutation
  // API
  // handler
  // redirect

  return (
    <LoginPage
      ...
    />
  )
}

Container bertanggung jawab terhadap:

Client state
Form state
API request
TanStack Query mutation/query
Authentication flow
Loading state
Error handling
Success handling
Redirect
Navigation
Token/session handling sesuai existing auth architecture
Event handler
Business flow
4. STRICT use client Rule
4.1 Allowed

Hanya Container:

'use client'

Contoh:

LoginContainer.tsx
RegisterContainer.tsx
ForgotPasswordContainer.tsx
VerifyOtpContainer.tsx
ResetPasswordContainer.tsx
4.2 Forbidden

Jangan menambahkan:

'use client'

ke:

atoms/
molecules/
organisms/
templates/
page/
wrapper/

kecuali terdapat kebutuhan framework yang benar-benar tidak dapat dihindari dan sudah disetujui secara eksplisit.

Untuk authentication implementation ini, target architecture adalah:

Container = Client
UI Components = Server-compatible / presentational
5. Callback / Function Propagation Rule

Semua function dari Container yang dibutuhkan UI WAJIB diteruskan melalui props.

Tidak boleh menggunakan:

Context hanya untuk menghindari prop drilling
Global event
Hidden callback
Internal API call dari component
State management tersembunyi di organism
Service call langsung dari organism

Contoh yang benar:

LoginContainer
      │
      │ onSubmit
      ▼
LoginPage
      │
      │ onSubmit
      ▼
LoginForm
      │
      │ onSubmit
      ▼
Form

Jika callback hanya digunakan oleh molecule:

LoginContainer
      │
      │ onEmailChange
      ▼
LoginForm
      │
      │ onEmailChange
      ▼
EmailField
      │
      │ onChange
      ▼
Input

Semua harus eksplisit melalui props.

6. Data Flow

Architecture:

User Interaction
      ↓
Atomic Component
      ↓
Callback via props
      ↓
Organism
      ↓
Page
      ↓
Container
      ↓
Service/API
      ↓
Backend

Response:

Backend
   ↓
API Service
   ↓
Container
   ↓
State
   ↓
Props
   ↓
Organism
   ↓
Molecule
   ↓
Atom

Tidak boleh terjadi:

Atom → API
Molecule → API
Organism → API
Template → API
Page → API
7. Authentication Endpoints

Backend Auth Module sudah menyediakan endpoint:

POST /login
POST /register
POST /forgotPassword
POST /verifyOtp/
POST /resetPassword
POST /loginGoogle

Gunakan endpoint existing.

Jangan membuat endpoint baru tanpa kebutuhan yang jelas.

Jangan mengubah kontrak backend hanya untuk menyesuaikan frontend.

8. Auth Service

Semua komunikasi HTTP authentication harus melalui service/API abstraction yang sudah digunakan project.

Contoh:

src/
└── services/
    └── auth/
        └── auth.service.ts

Atau gunakan struktur existing project apabila sudah tersedia.

Contoh interface:

authService.login()
authService.register()
authService.forgotPassword()
authService.verifyOtp()
authService.resetPassword()
authService.loginGoogle()

Container tidak boleh membuat HTTP client baru.

Jangan membuat:

axios.post(...)

langsung di component jika project sudah memiliki API abstraction.

9. Auth Page Structure

Gunakan Atomic Design existing project.

Recommended structure:

src/
├── app/
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       ├── forgot-password/
│       │   └── page.tsx
│       ├── verify-otp/
│       │   └── page.tsx
│       └── reset-password/
│           └── page.tsx
│
├── containers/
│   └── auth/
│       ├── LoginContainer.tsx
│       ├── RegisterContainer.tsx
│       ├── ForgotPasswordContainer.tsx
│       ├── VerifyOtpContainer.tsx
│       └── ResetPasswordContainer.tsx
│
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ForgotPasswordForm.tsx
│   │       ├── VerifyOtpForm.tsx
│   │       └── ResetPasswordForm.tsx
│   │
│   ├── page/
│   │   └── auth/
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       ├── ForgotPasswordPage.tsx
│   │       ├── VerifyOtpPage.tsx
│   │       └── ResetPasswordPage.tsx
│   │
│   ├── templates/
│   │   └── auth/
│   │       └── AuthTemplate.tsx
│   │
│   ├── pwa/
│   └── wrapper/
│
├── services/
├── queries/
├── schemas/
└── types/
Important

Sebelum membuat folder/file baru:

Inspect existing project.
Cari Container architecture yang sudah digunakan.
Cari existing auth component.
Cari existing API service.
Cari existing query/mutation abstraction.
Cari existing Atomic Design components.
Reuse existing components jika tersedia.

Jangan membuat duplicate component.

Jika project memiliki struktur berbeda tetapi masih mengikuti prinsip yang sama, ikuti struktur existing project.

10. Login Flow
10.1 Architecture
/app/(auth)/login/page.tsx
          ↓
LoginContainer
          ↓
LoginPage
          ↓
AuthTemplate
          ↓
LoginForm
          ↓
Molecules
          ↓
Atoms
10.2 Container Responsibilities

LoginContainer menangani:

Email state
Password state
Validation
Login mutation
Loading state
Error state
Success state
Google login flow
Redirect setelah login

Contoh:

'use client'

export function LoginContainer() {
  const handleSubmit = async (data: LoginFormData) => {
    // call auth service
  }

  const handleGoogleLogin = () => {
    // google login flow
  }

  return (
    <LoginPage
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      ...
    />
  )
}
11. Register Flow

Flow:

Register Page
      ↓
RegisterContainer
      ↓
RegisterPage
      ↓
AuthTemplate
      ↓
RegisterForm
      ↓
Molecules
      ↓
Atoms

Container menangani:

Form state
Validation
Register API
Loading
Error
Success
Redirect/navigation

UI hanya menerima:

<RegisterForm
  values={values}
  errors={errors}
  loading={loading}
  onSubmit={handleSubmit}
  onChange={handleChange}
/>
12. Forgot Password Flow

Flow:

Forgot Password
      ↓
ForgotPasswordContainer
      ↓
ForgotPasswordPage
      ↓
ForgotPasswordForm

Container:

Input Email
    ↓
POST /forgotPassword
    ↓
OTP Sent
    ↓
Navigate Verify OTP

Handler:

onSubmit

harus berasal dari Container.

13. Verify OTP Flow

Flow:

Verify OTP
      ↓
VerifyOtpContainer
      ↓
VerifyOtpPage
      ↓
VerifyOtpForm
      ↓
OtpInput

Container menangani:

OTP state
Email/reference state sesuai existing flow
Verify OTP API
Error handling
Loading
Success
Navigation ke reset password

Contoh:

<VerifyOtpForm
  otp={otp}
  loading={loading}
  error={error}
  onOtpChange={handleOtpChange}
  onSubmit={handleSubmit}
/>
14. Reset Password Flow

Flow:

Reset Password
      ↓
ResetPasswordContainer
      ↓
ResetPasswordPage
      ↓
ResetPasswordForm

Container menangani:

Password
Confirm password
Validation
Reset password API
Loading
Error
Success
Redirect ke login

UI tidak mengetahui bagaimana API reset password bekerja.

15. Google Login

Google Login harus mengikuti endpoint existing:

POST /loginGoogle

Namun sebelum implementasi:

Inspect existing backend contract.
Inspect response structure.
Inspect existing authentication/session handling.
Inspect apakah endpoint menerima credential/token/code.
Ikuti kontrak existing.

Jangan mengasumsikan payload Google Login.

16. Form Validation

Validation dibagi menjadi dua:

Frontend Validation
        ↓
UX validation
        ↓
Backend Validation
        ↓
Authoritative validation

Frontend digunakan untuk:

Required field
Format email
Password confirmation
OTP length/format
Immediate feedback

Backend tetap menjadi source of truth.

Schema validation sebaiknya dipisahkan:

schemas/
└── auth/
    └── auth.schema.ts

Contoh:

loginSchema
registerSchema
forgotPasswordSchema
verifyOtpSchema
resetPasswordSchema

Gunakan validation library yang sudah digunakan project.

Jangan menambahkan library baru jika tidak diperlukan.

17. TanStack Query

Jika project sudah menggunakan TanStack Query:

Gunakan TanStack Query pada Container atau abstraction yang dipanggil oleh Container.

Contoh:

LoginContainer
      ↓
useLoginMutation()
      ↓
authService.login()
      ↓
API

Jangan:

LoginForm
      ↓
useMutation()

Organism tetap presentational.

18. Error Handling

Error API harus dinormalisasi pada layer API/service/query atau Container.

UI menerima error yang sudah siap ditampilkan.

Contoh:

<LoginForm
  error={error}
  ...
/>

Jangan membuat UI memahami struktur error backend.

Tidak boleh:

if (error.response.data.code === ...)

di Atom/Molecule/Organism.

19. Loading State

Loading berasal dari Container.

Contoh:

<LoginForm
  loading={isPending}
  onSubmit={handleSubmit}
/>

Organism hanya menampilkan:

loading = true
    ↓
disable submit
    ↓
show loading indicator

Organism tidak menentukan kapan loading dimulai atau selesai.

20. Success State

Success flow ditangani Container.

Contoh:

Login Success
     ↓
Container
     ↓
Update auth state
     ↓
Redirect

Bukan:

LoginForm
     ↓
router.push(...)
21. Routing

Semua routing authentication dilakukan dari Container.

Contoh:

const router = useRouter()

const handleLogin = async (...) => {
  await login(...)
  router.push('/dashboard')
}

Jangan menggunakan:

useRouter()

di:

atoms
molecules
organisms
templates
page
22. Props Contract

Setiap component harus memiliki props yang eksplisit.

Contoh:

interface LoginFormProps {
  email: string
  password: string
  errors?: LoginFormErrors
  loading?: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  onGoogleLogin: () => void
}

Kemudian:

Container
   ↓
LoginForm

Semua function dikirim melalui props.

23. No Hidden Business Logic

Jangan membuat logic authentication tersembunyi di component.

Forbidden:

// LoginForm.tsx

const handleLogin = async () => {
  await authService.login(...)
}

Forbidden:

// LoginForm.tsx

const mutation = useMutation(...)

Forbidden:

// LoginForm.tsx

const router = useRouter()

Forbidden:

// Button.tsx

if (userAuthenticated) {
  ...
}

Authentication decision harus berada pada Container/application layer.

24. Atomic Component Reuse

Sebelum membuat component baru:

1. Search atoms existing
2. Search molecules existing
3. Search organisms existing
4. Search templates existing
5. Reuse jika tersedia

Contoh:

Jika sudah ada:

Input
PasswordInput
Button
FormLabel
FormError

jangan membuat:

AuthInput
LoginInput
RegisterInput

tanpa alasan yang kuat.

25. Authentication Flow
Login
User
 ↓
Login Form
 ↓
Container
 ↓
POST /login
 ↓
Auth Response
 ↓
Store/Update Auth State
 ↓
Redirect
Register
User
 ↓
Register Form
 ↓
Container
 ↓
POST /register
 ↓
Success
 ↓
Redirect sesuai existing product flow
Forgot Password
User
 ↓
Forgot Password Form
 ↓
Container
 ↓
POST /forgotPassword
 ↓
OTP Sent
 ↓
Verify OTP
Verify OTP
User
 ↓
OTP Form
 ↓
Container
 ↓
POST /verifyOtp/
 ↓
OTP Valid
 ↓
Reset Password
Reset Password
User
 ↓
Reset Password Form
 ↓
Container
 ↓
POST /resetPassword
 ↓
Success
 ↓
Login
26. Security Rules

Jangan melakukan logging terhadap:

password
confirmPassword
OTP
accessToken
refreshToken
Google credential

Jangan menyimpan sensitive data di UI component.

Backend tetap menjadi authority untuk authentication.

27. Implementation Phases
Phase 1 — Project Inspection

Inspect:

src/app
src/components
src/containers
src/services
src/api
src/hooks
src/providers
src/lib
src/types
src/schemas

Cari:

Existing Atomic Design structure
Existing auth components
Existing API client
Existing query hooks
Existing auth state
Existing routing conventions
Existing form validation
Existing error handling

Output:

Architecture Map
Existing Components
Existing Services
Existing Auth Flow
Phase 2 — Auth API Integration

Implement/reuse:

login
register
forgotPassword
verifyOtp
resetPassword
loginGoogle

Pastikan:

Request payload sesuai backend
Response type sesuai backend
Error handling konsisten
Tidak ada duplicate API client
Phase 3 — Login

Implement:

LoginContainer
LoginPage
LoginForm integration
Google Login

Acceptance:

[ ] Login berhasil
[ ] Invalid credential ditampilkan
[ ] Loading state bekerja
[ ] Button disabled saat request
[ ] Success redirect bekerja
[ ] Google login bekerja sesuai backend contract
[ ] Tidak ada API call dari UI component
Phase 4 — Register

Implement:

RegisterContainer
RegisterPage
RegisterForm integration

Acceptance:

[ ] Register berhasil
[ ] Validation bekerja
[ ] Backend error ditampilkan
[ ] Loading state bekerja
[ ] Success flow bekerja
Phase 5 — Forgot Password

Implement:

ForgotPasswordContainer
ForgotPasswordPage
ForgotPasswordForm

Acceptance:

[ ] Email validation
[ ] API request
[ ] Loading
[ ] Error
[ ] Success
[ ] Navigate to OTP
Phase 6 — Verify OTP

Implement:

VerifyOtpContainer
VerifyOtpPage
VerifyOtpForm

Acceptance:

[ ] OTP input bekerja
[ ] OTP validation
[ ] API request
[ ] Invalid OTP handling
[ ] Loading state
[ ] Success navigation
Phase 7 — Reset Password

Implement:

ResetPasswordContainer
ResetPasswordPage
ResetPasswordForm

Acceptance:

[ ] Password validation
[ ] Confirm password validation
[ ] API request
[ ] Error handling
[ ] Success handling
[ ] Redirect to login
Phase 8 — Integration Testing

Test seluruh flow:

Register
   ↓
Login
   ↓
Authenticated User

dan:

Forgot Password
   ↓
Verify OTP
   ↓
Reset Password
   ↓
Login

Google:

Google Login
   ↓
Authentication
   ↓
Authenticated User
28. Architecture Validation Checklist

Sebelum dianggap selesai, lakukan pemeriksaan:

Client Boundary
[ ] Hanya Container yang menggunakan 'use client'
[ ] Tidak ada 'use client' di atoms
[ ] Tidak ada 'use client' di molecules
[ ] Tidak ada 'use client' di organisms
[ ] Tidak ada 'use client' di templates
[ ] Tidak ada 'use client' di page
API
[ ] Tidak ada API request di atom
[ ] Tidak ada API request di molecule
[ ] Tidak ada API request di organism
[ ] Tidak ada API request di template
[ ] API dipanggil dari Container/service abstraction
Routing
[ ] Tidak ada useRouter di atom
[ ] Tidak ada useRouter di molecule
[ ] Tidak ada useRouter di organism
[ ] Tidak ada useRouter di template
[ ] Routing ditangani Container
Callback
[ ] Semua callback berasal dari Container
[ ] Callback dikirim menggunakan props
[ ] Tidak menggunakan hidden callback
[ ] Tidak membuat Context hanya untuk menghindari prop drilling
[ ] Callback diteruskan sampai component yang membutuhkan
Atomic Design
[ ] Existing atoms digunakan kembali
[ ] Existing molecules digunakan kembali
[ ] Existing organisms digunakan kembali
[ ] Tidak ada duplicate component
[ ] Organism tetap presentational
[ ] Template hanya menangani layout
29. Forbidden Architecture

AI agent DILARANG menghasilkan architecture seperti:

LoginForm
 ├── useMutation
 ├── useRouter
 ├── authService
 └── API

Dilarang:

Atom
 └── API

Dilarang:

Molecule
 └── useQuery

Dilarang:

Organism
 └── useMutation

Dilarang:

Page
 └── API call

Dilarang menggunakan Context hanya untuk menghindari:

Container
 ↓
Page
 ↓
Organism
 ↓
Molecule

Prop drilling memang merupakan bagian dari architecture ini dan harus dilakukan secara eksplisit.

30. Definition of Done

Auth integration dianggap selesai jika:

Architecture
[ ] Atomic Design existing project tetap digunakan
[ ] Tidak merombak struktur project tanpa alasan
[ ] Container menjadi orchestration layer
[ ] UI components bersifat presentational
Client Boundary
[ ] 'use client' hanya di Container
[ ] Tidak ada unnecessary client boundary
API
[ ] Login terintegrasi
[ ] Register terintegrasi
[ ] Forgot Password terintegrasi
[ ] Verify OTP terintegrasi
[ ] Reset Password terintegrasi
[ ] Google Login terintegrasi
UX
[ ] Loading state
[ ] Error state
[ ] Validation state
[ ] Success state
[ ] Disabled state
Security
[ ] Password tidak di-log
[ ] OTP tidak di-log
[ ] Token tidak di-log
[ ] Authentication logic tidak berada di UI component
Code Quality
[ ] Tidak ada duplicate API client
[ ] Tidak ada duplicate Atomic component
[ ] Tidak ada API call di UI component
[ ] Tidak ada routing di UI component
[ ] Semua callback melalui props
[ ] TypeScript types tersedia
[ ] Existing project conventions dipertahankan
31. Final Architecture

Target akhir:

                         APP ROUTE
                            │
                            ▼
                         CONTAINER
                      'use client'
                            │
              ┌─────────────┼─────────────┐
              │             │             │
             State         API          Router
              │             │             │
              └─────────────┼─────────────┘
                            │
                          Props
                            │
                            ▼
                           PAGE
                            │
                          Props
                            ▼
                        TEMPLATE
                            │
                          Props
                            ▼
                        ORGANISM
                            │
                          Props
                            ▼
                        MOLECULE
                            │
                          Props
                            ▼
                           ATOM

API flow:

Container
    ↓
Query / Mutation
    ↓
Auth Service
    ↓
API Client
    ↓
Backend Auth Module

Tidak boleh ada business logic authentication di bawah Container.

Container adalah orchestration layer. Atomic Design components adalah presentation layer. Service/API adalah communication layer. Backend adalah business authority.
````
