Saya ingin kamu melakukan AUDIT lalu IMPLEMENTASI fitur Practice / Latihan pada backend SIMANTIK.

PENTING:
Jangan langsung coding sebelum memahami struktur project dan file-file yang saya tag.

Saya akan tag beberapa file yang berhubungan dengan:
- Question
- Practice / Latihan jika sudah ada
- Tryout
- Module / Learning
- Model
- Repository
- Service
- Handler
- Routes
- DTO
- Migration jika relevan

==================================================
CONTEXT PROJECT
==================================================

Backend:
- Go
- GoFiber v2
- GORM
- PostgreSQL (Neon)

Arsitektur backend kurang lebih:

Handler
  ↓
Service
  ↓
Repository
  ↓
Database

Business logic harus berada di Service Layer.
Handler hanya menangani HTTP request/response.
Repository hanya menangani akses data.

Jangan merusak architecture atau pattern yang sudah ada.
Ikuti naming convention, response format, error handling,
dependency injection, validation, pagination, dan pattern
repository/service yang sudah digunakan project.

==================================================
MASALAH YANG INGIN DIPERBAIKI
==================================================

Saat ini sistem sudah memiliki konsep Question dan Tryout,
tetapi endpoint untuk Practice / Latihan belum tersedia atau
belum lengkap.

Practice TIDAK sama dengan Tryout.

Saya ingin Practice menjadi fitur tersendiri dan nantinya
ditampilkan sebagai menu/flow yang berbeda di Web App.

Sebelum implementasi, periksa seluruh file yang saya tag dan
tentukan terlebih dahulu:

1. Apakah sebenarnya model/entity Practice sudah tersedia?
2. Apakah sudah ada konsep Practice Package?
3. Apakah Question saat ini hanya terhubung ke Tryout?
4. Apakah schema Question memungkinkan digunakan oleh Practice?
5. Apakah repository Practice sudah ada?
6. Apakah service Practice sudah ada?
7. Apakah handler/controller Practice sudah ada?
8. Apakah route Practice sudah terdaftar?
9. Apakah DTO request/response Practice sudah tersedia?
10. Apakah ada bagian existing code yang bisa digunakan kembali
    tanpa membuat duplicate logic?

JANGAN berasumsi fitur belum ada.
Audit source code terlebih dahulu.

==================================================
BUSINESS RULE — PRACTICE
==================================================

Practice / Latihan berbeda dengan Tryout.

Practice TIDAK memiliki difficulty level.

Jangan menggunakan adaptive difficulty untuk Practice.

Jangan membuat:
- current_level
- difficulty progression
- adaptive question selection
- level up
- level down
- difficulty streak

pada Practice.

Semua question di dalam sebuah Practice Package dianggap
sebagai kumpulan soal latihan biasa.

Contoh:

Practice
└── Paket Latihan 1
    ├── Question 1
    ├── Question 2
    ├── Question 3
    └── Question N

Practice
└── Paket Latihan 2
    ├── Question 1
    ├── Question 2
    └── Question N

Jadi user nantinya melihat:

Latihan
├── Paket Latihan 1
├── Paket Latihan 2
├── Paket Latihan 3
└── ...

User memilih salah satu paket kemudian mengerjakan soal
di dalam paket tersebut.

==================================================
PRACTICE PACKAGE
==================================================

Saya membutuhkan konsep Practice Package.

Contoh conceptual entity:

PracticePackage
- id
- title
- description
- slug (jika pattern project menggunakan slug)
- status
- total_questions / atau dihitung dari relation
- created_at
- updated_at

Tetapi:

JANGAN langsung membuat model berdasarkan contoh tersebut.

Periksa model dan schema existing terlebih dahulu.

Jika struktur project sudah memiliki entity yang dapat
merepresentasikan Practice Package, gunakan existing entity
daripada membuat duplicate model.

Jika memang belum ada, baru usulkan model yang paling sesuai
dengan architecture project.

==================================================
QUESTION RELATION
==================================================

Periksa bagaimana Question saat ini dimodelkan.

Saya ingin Question Bank tetap menjadi source utama soal.

Question dapat digunakan pada:

Question Bank
      │
      ├───────────────┐
      ↓               ↓
Practice Package    Tryout
      │               │
Normal Practice    Adaptive Test
      │               │
No Difficulty      Difficulty 1–5
Progression        Adaptive Selection

Jangan duplicate Question hanya karena digunakan pada
Practice dan Tryout.

Jika dibutuhkan many-to-many relation, pertimbangkan
junction/pivot entity seperti:

PracticePackageQuestion

dan gunakan pattern yang paling sesuai dengan existing
database architecture.

Contoh conceptual relation:

PracticePackage
        │
        │ 1:N / M:N
        ↓
PracticePackageQuestion
        │
        ↓
Question

Tetapi kembali:
audit schema existing terlebih dahulu sebelum menentukan
implementasi final.

==================================================
TRYOUT TIDAK BOLEH BERUBAH
==================================================

Jangan mengubah business rule Tryout yang sudah ada.

Tryout tetap:

- 30 questions per tryout
- 5 answer choices per question
- 5 difficulty levels
- adaptive question selection

Adaptive rule yang saat ini digunakan:

Correct streak
      ↓
2 consecutive correct
      ↓
level +1

Jika mencapai rule berikutnya sesuai implementasi existing,
level dapat naik lagi.

Incorrect
      ↓
level -1

Difficulty dibatasi:

1 <= difficulty <= 5

Practice TIDAK menggunakan mekanisme tersebut.

==================================================
PRACTICE API
==================================================

Setelah audit, implementasikan API Practice yang diperlukan.

Gunakan route naming/versioning yang sudah digunakan project.
Jangan membuat convention baru jika project sudah memiliki
pattern sendiri.

Secara capability, saya membutuhkan endpoint equivalent untuk:

STUDENT
--------------------------------------------------

GET /practices

Mengambil daftar Practice Package yang tersedia.

Response minimal harus memungkinkan frontend menampilkan:

- package id
- title
- description
- total questions
- status/progress user jika memang architecture sudah mendukung

--------------------------------------------------

GET /practices/:id

Mengambil detail Practice Package.

Jangan expose correct answer jika endpoint ini digunakan
sebelum user mengerjakan soal.

--------------------------------------------------

POST /practices/:id/start

Memulai Practice Attempt.

Backend harus membuat attempt/session sehingga progress
latihan tidak hanya disimpan di frontend.

Return data yang dibutuhkan frontend untuk membuka halaman
latihan.

--------------------------------------------------

GET /practice-attempts/:attemptId

Mengambil state attempt yang sedang berjalan.

Harus memungkinkan refresh halaman tanpa kehilangan progress.

--------------------------------------------------

POST /practice-attempts/:attemptId/answer

Submit/save jawaban user.

Gunakan DTO yang jelas.

Contoh conceptual payload:

{
  "question_id": "...",
  "answer": "..."
}

Sesuaikan dengan Question Type dan DTO existing.

--------------------------------------------------

POST /practice-attempts/:attemptId/submit

Menyelesaikan Practice Attempt.

Backend melakukan scoring.

--------------------------------------------------

GET /practice-attempts/:attemptId/result

Mengambil hasil latihan.

Result minimal:

- total questions
- correct
- incorrect
- unanswered
- score
- answers/review jika diperbolehkan business rule
- explanation/discussion jika tersedia

==================================================
MANAGEMENT API
==================================================

Periksa role dan permission existing.

Admin atau Content Manager harus dapat mengelola
Practice Package sesuai authorization architecture project.

Capability yang dibutuhkan:

GET    /practice-packages
POST   /practice-packages
GET    /practice-packages/:id
PUT    /practice-packages/:id
DELETE /practice-packages/:id

Kemudian perlu capability untuk mengatur soal dalam paket:

POST   /practice-packages/:id/questions
DELETE /practice-packages/:id/questions/:questionId

Jika project menggunakan bulk assignment, lebih baik gunakan
pattern existing.

Contoh:

PUT /practice-packages/:id/questions

{
  "question_ids": [
    "...",
    "...",
    "..."
  ]
}

Jangan membuat endpoint duplicate apabila existing architecture
sudah mempunyai generic question assignment mechanism.

==================================================
PRACTICE ATTEMPT
==================================================

Periksa apakah existing Attempt model untuk Tryout bisa
digeneralisasi.

JANGAN otomatis membuat PracticeAttempt baru.

Analisis dahulu apakah:

Option A

Attempt
├── PRACTICE
└── TRYOUT

lebih cocok,

atau:

Option B

PracticeAttempt
TryoutAttempt

lebih cocok dengan existing architecture.

Pilih berdasarkan source code yang ada, bukan berdasarkan
preferensi semata.

Jika reuse Attempt menyebabkan Tryout adaptive logic menjadi
terlalu coupled dengan Practice, lebih baik pisahkan.

Jelaskan keputusan tersebut sebelum implementasi.

==================================================
SCORING PRACTICE
==================================================

Practice menggunakan scoring sederhana:

score = (correct / total_questions) * 100

Answer status:

CORRECT
INCORRECT
UNANSWERED

Tidak ada negative marking.

Scoring harus dilakukan backend.

Frontend tidak boleh menjadi source of truth untuk score.

==================================================
SECURITY
==================================================

Pastikan:

- student hanya bisa mengakses attempt miliknya
- correct answer tidak dikirim sebelum waktunya
- scoring dilakukan server-side
- management endpoint menggunakan role middleware
- request ID harus divalidasi
- package harus published/active sebelum bisa dikerjakan student
- question yang inactive/unpublished tidak boleh masuk attempt
  kecuali architecture existing mempunyai version/snapshot rule
- client tidak boleh menentukan score sendiri

==================================================
WEB APP INTEGRATION CONTRACT
==================================================

Walaupun task utama adalah backend, response API harus dibuat
agar nantinya mudah diintegrasikan ke frontend.

Frontend nantinya memiliki flow:

/student/latihan
        ↓
Practice Package List
        ↓
/student/latihan/[id]
        ↓
Package Detail
        ↓
Start Practice
        ↓
Practice Session
        ↓
Submit
        ↓
Practice Result

Practice harus benar-benar terpisah secara UX dari:

/student/tryout

Jangan memasukkan konsep adaptive level ke response Practice
jika tidak dibutuhkan.

==================================================
IMPLEMENTATION PROCESS
==================================================

Kerjakan dalam urutan berikut.

PHASE 1 — AUDIT

Baca semua file yang saya tag.

Buat laporan singkat:

Existing:
- Models
- Relations
- DTO
- Repository
- Service
- Handler
- Routes
- Middleware
- Question assignment
- Attempt system
- Scoring system

Kemudian buat:

FOUND
MISSING
NEEDS MODIFICATION
CAN REUSE

Jangan coding sebelum audit selesai.

PHASE 2 — GAP ANALYSIS

Bandingkan existing implementation dengan requirement Practice.

Tuliskan:

Existing Architecture
        ↓
Missing Components
        ↓
Required Changes

Identifikasi juga potensi breaking changes.

PHASE 3 — IMPLEMENTATION PLAN

Sebelum coding, tuliskan file mana yang akan:

CREATE
MODIFY
REUSE
NOT TOUCH

Contoh:

CREATE
internal/models/practice_package.go
internal/service/practice_service.go
...

MODIFY
internal/routes/...
...

REUSE
QuestionRepository
ScoringService
...

NOT TOUCH
Tryout adaptive engine
...

Gunakan actual path dari repository.
Jangan mengarang path.

PHASE 4 — IMPLEMENTATION

Setelah plan jelas, implementasikan feature end-to-end:

Model
  ↓
DTO
  ↓
Repository
  ↓
Service
  ↓
Handler
  ↓
Routes

Jika schema database berubah, sesuaikan dengan migration
strategy/GORM migration mechanism yang memang digunakan project.

Jangan membuat migration mechanism baru.

PHASE 5 — VALIDATION

Setelah implementasi:

- jalankan formatter
- jalankan build
- jalankan tests yang tersedia
- perbaiki compile error
- periksa route registration
- periksa dependency injection
- periksa GORM relation
- periksa JSON serialization
- periksa authorization
- periksa ownership
- periksa error handling

Jangan menganggap task selesai jika code belum compile.

==================================================
IMPORTANT CONSTRAINTS
==================================================

1. Practice != Tryout.
2. Practice tidak memiliki difficulty level.
3. Practice tidak adaptive.
4. Practice memiliki Practice Package.
5. Satu package berisi banyak questions.
6. Question Bank tetap menjadi source utama Question.
7. Jangan duplicate Question tanpa alasan architecture yang kuat.
8. Jangan merusak Tryout adaptive engine.
9. Backend adalah source of truth.
10. Jangan mengubah architecture project tanpa kebutuhan.
11. Reuse existing repository/service/helper jika memungkinkan.
12. Jangan membuat duplicate utility.
13. Jangan membuat endpoint berdasarkan asumsi jika sebenarnya
    endpoint equivalent sudah ada.
14. Ikuti response/error format existing.
15. Semua perubahan harus backward-compatible sebisa mungkin.

==================================================
EXPECTED FINAL REPORT
==================================================

Setelah selesai berikan:

1. Audit Result
2. Gap Analysis
3. Architecture Decision
4. Database Changes
5. Files Created
6. Files Modified
7. Endpoints Added
8. Example Request/Response
9. Authorization Rules
10. Testing/Build Result
11. Remaining TODO / unresolved business decisions

Yang paling penting:

JANGAN sekadar menambahkan route.

Pastikan flow:

Practice Package
      ↓
Question Assignment
      ↓
Student Start Practice
      ↓
Practice Attempt
      ↓
Answer Persistence
      ↓
Submit
      ↓
Server-side Scoring
      ↓
Practice Result

benar-benar bekerja end-to-end.

Mulai dengan membaca dan menganalisis semua file yang saya tag.
Jangan melakukan perubahan sebelum kamu memahami existing
implementation.