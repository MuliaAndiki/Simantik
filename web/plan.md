# Page & Screen Requirements Plan

## 1. Purpose

Dokumen ini mendefinisikan kebutuhan setiap **page/screen** yang terdapat dalam SIMANTIK berdasarkan:

- Information Architecture
- User Flow
- User Journey
- User Role & Permission
- Learning Flow
- Practice Flow
- Tryout Flow
- Evaluation & Recommendation Flow
- Content Management System
- Existing Frontend Route Structure

Dokumen ini menjadi acuan bersama untuk:

- Product
- UI/UX
- Frontend
- Backend
- QA

sebelum implementasi halaman dimulai.

> Dokumen ini mendefinisikan **apa yang harus tersedia pada sebuah halaman**, bukan detail visual final seperti warna, typography, spacing, atau design system.

---

# 2. Page Architecture

Struktur halaman SIMANTIK mengikuti pembagian berdasarkan role.

````text
APP
│
├── Public
│
├── Authentication
│
└── Protected Area
    │
    ├── Dashboard
    │
    ├── Student
    │
    ├── Admin
    │
    └── Content Manager

    Existing application structure:

Area	Role	Access
Public	Guest	Public
Authentication	Guest	Public
Dashboard	Authenticated User	Authenticated
Student	Student	Student
Admin	Admin	Admin
Content Manager	Content Manager	Content Manager

Permission detail tetap mengacu pada dokumen User Roles & Permissions.

3. Page Classification
Group	Description
Public	Halaman yang dapat diakses tanpa login
Authentication	Halaman authentication
Dashboard	Dashboard berdasarkan authenticated user
Student	Fitur pembelajaran siswa
Admin	Administrasi sistem dan pengguna
Content Manager	Pengelolaan konten pembelajaran
4. Page Inventory
4.1 Public Pages
Page	Route	Priority
Beranda	/	MVP
Tentang SIMANTIK	/tentang	MVP
Materi	/materi	MVP
Berita	/berita	P1
Dokumentasi	/dokumentasi	P1
Testimoni	/testimoni	P1
Tutorial	/tutorial	P1
5. Authentication Pages

Authentication page berada di luar role karena digunakan sebelum user memiliki role aktif di application session.

Page	Route	Priority
Login	/login	MVP
Register	/register	TBD
Forgot Password	/forgot-password	MVP
Verify OTP	/verify-otp	MVP
Reset Password	/reset-password	MVP
Authentication Flow
Login
  ↓
Authentication
  ↓
Identify Role
  │
  ├── Student
  │      ↓
  │   Dashboard / Student Area
  │
  ├── Admin
  │      ↓
  │   Admin Area
  │
  └── Content Manager
         ↓
      Content Manager Area

Registration masih TBD sesuai keputusan product sebelumnya.

6. Dashboard Pages

Directory:

app/
└── dashboard/

Dashboard merupakan entry point setelah user berhasil login.

6.1 Dashboard

Route: /dashboard

Access: Authenticated User

Purpose

Memberikan overview aktivitas dan informasi utama user setelah login.

Student Dashboard

Minimal menampilkan:

Learning progress
Aktivitas terakhir
Latihan terakhir
Tryout terakhir
Score terakhir
Competency overview
Recommendation
CTA aktivitas berikutnya
Admin Dashboard

Jika dashboard digunakan sebagai entry point admin, dapat menampilkan:

Total student
Active student
Total material
Total question
Total tryout
Recent activity
Content status
Content Manager Dashboard

Dapat menampilkan:

Total material
Total question
Total tryout
Draft content
Content awaiting review
Published content
Recent content activity

Bentuk dashboard dapat berbeda berdasarkan role. Implementasi harus mengikuti role & permission.

7. Student Pages

Directory:

app/
└── student/

Seluruh page di bawah /student hanya dapat diakses oleh role:

STUDENT
8. Student Learning Pages
8.1 Learning Overview

Route:

/student/belajar

Role: Student

Purpose

Menjadi halaman utama aktivitas pembelajaran siswa.

Information

Minimal:

Daftar materi
Category
Difficulty
Progress
Completion status
Estimated learning time
Actions
Search
Filter
Open material
Continue learning
States
Loading
Empty
No search result
Error
8.2 Material Detail

Route:

/student/belajar/[slug]

Role: Student

Purpose

Menampilkan materi pembelajaran secara lengkap.

Information
Title
Description
Content
Learning objective
Category
Difficulty
Progress
Related material
Actions
Start learning
Continue learning
Start practice
Open related material
States
Loading
Not found
Unavailable
Error
8.3 Learning Recommendation

Route:

/student/belajar/rekomendasi

Role: Student

Purpose

Menampilkan materi yang direkomendasikan berdasarkan performa siswa.

Information
Recommended material
Related competency
Recommendation reason
Priority
Learning progress
Primary Action
Mulai Belajar
9. Student Practice Pages
9.1 Practice Overview

Route:

/student/latihan

Role: Student

Purpose

Menampilkan latihan yang tersedia untuk siswa.

Information
Practice title
Category
Number of questions
Difficulty
Previous result
Status
Actions
Start practice
Continue practice
View result
States
Loading
Empty
Error
10. Practice Session

Route:

/student/latihan/[id]

Role: Student

Purpose

Menjadi workspace siswa saat mengerjakan latihan.

Main Information
Question
Question number
Answer options
Progress
Answer status
Actions
Select answer
Next question
Previous question
Submit
Flow
Practice
   ↓
Start
   ↓
Practice Session
   ↓
Answer
   ↓
Save Answer
   ↓
Next / Previous
   ↓
Finish
   ↓
Submit
   ↓
Practice Result
TBD
Apakah latihan menggunakan timer?
Apakah student dapat kembali ke soal sebelumnya?
Apakah student dapat mengubah jawaban?
Apakah student dapat skip question?
11. Practice Result

Route:

/student/latihan/[id]/hasil

Role: Student

Purpose

Menampilkan hasil latihan dan feedback.

Information
Score
Total questions
Correct
Incorrect
Unanswered
Question review
Explanation
Competency performance jika tersedia
Actions
Review answers
Try again
Continue learning
12. Student Tryout Pages
12.1 Tryout Overview

Route:

/student/tryout

Role: Student

Purpose

Menampilkan daftar tryout yang tersedia.

Information
Tryout title
Description
Number of questions
Duration
Difficulty
Availability
Previous attempt
Previous score
Actions
View detail
Start tryout
View result
13. Tryout Detail

Route:

/student/tryout/[id]

Role: Student

Purpose

Memberikan informasi sebelum siswa memulai tryout.

Information
Tryout title
Description
Number of questions
Duration
Difficulty
Rules
Instructions
Attempt information
Primary Action
Mulai Tryout
Flow
Tryout Detail
      ↓
Read Instructions
      ↓
Start
      ↓
Tryout Session
TBD
Maximum attempt
Retake policy
Previous result visibility
Availability period
14. Tryout Session

Route:

/student/tryout/[id]/session

Role: Student

Purpose

Menjadi workspace utama siswa ketika mengerjakan tryout.

Main Information
Question
Question number
Answer options
Progress
Timer
Answer status
Question navigation
Actions
Select answer
Navigate question
Submit tryout
Timer

Timer merupakan bagian penting dari tryout.

Start Tryout
      ↓
Start Timer
      ↓
Answer Questions
      │
      ├── Manual Submit
      │       ↓
      │   Submit
      │
      └── Timer = 0
              ↓
          Auto Submit

Frontend bertugas menampilkan countdown.

Backend menjadi authority terhadap:

startedAt
expiresAt
submit time
session status
15. Adaptive Tryout

Tryout SIMANTIK menggunakan adaptive difficulty sesuai requirement product.

Tryout terdiri dari:

5 Difficulty Levels
30 Questions
5 Answer Choices

Adaptive behavior:

Current Difficulty
       ↓
Answer
       ↓
Evaluate
       │
       ├── Correct consecutively
       │       ↓
       │   Increase difficulty
       │
       └── Incorrect
               ↓
          Decrease difficulty

Rule detail adaptive testing harus mengikuti dokumen:

06. Tryout System/03. Adaptive Test Requirements

Detail algoritma adaptive tidak didefinisikan ulang pada page requirement.

16. Tryout Result

Route:

/student/tryout/[id]/hasil

Role: Student

Purpose

Menampilkan hasil tryout setelah session selesai.

Information
Score
Total questions
Correct
Incorrect
Unanswered
Performance
Competency
Difficulty performance
Strength
Weakness
Actions
Lihat evaluasi
Lihat rekomendasi
Review result
Flow
Tryout Result
      ↓
Evaluation
      ↓
Competency Analysis
      ↓
Recommendation
17. Student Evaluation Pages
17.1 Evaluation Overview

Route:

/student/evaluasi

Role: Student

Purpose

Menampilkan gambaran kemampuan siswa berdasarkan aktivitas assessment.

Information
Overall score
Performance
Competency summary
Strength
Weakness
Performance trend
Recommendation
Primary Actions
Lihat kompetensi
Lihat rekomendasi
Mulai belajar
18. Competency Evaluation

Route:

/student/evaluasi/kompetensi

Role: Student

Purpose

Menampilkan performa berdasarkan competency.

Information
Competency
Score
Performance status
Trend
Related learning material
Performance Status

Conceptually:

STRONG
DEVELOPING
NEEDS_IMPROVEMENT
INSUFFICIENT_DATA

Threshold final mengikuti Evaluation Requirements.

19. Recommendation

Route:

/student/evaluasi/rekomendasi

Role: Student

Purpose

Mengubah hasil evaluasi menjadi tindakan belajar berikutnya.

Recommendation Types
Learning material
Practice
Tryout
Competency improvement
Information

Setiap recommendation minimal memiliki:

Recommendation
Reason
Related competency
Priority
Action
Flow
Performance
     ↓
Evaluation
     ↓
Weak / Developing Competency
     ↓
Recommendation
     ↓
Learning Action
20. Student Profile

Route:

/student/profile

Role: Student

Purpose

Mengelola informasi akun siswa.

Information
Full name
Email
Profile information
Account information
Actions
Edit profile
Change password
Logout

Detail field mengikuti:

04. User & Role/02. Student Requirements

21. Admin Pages

Directory:

app/
└── admin/

Seluruh halaman admin hanya dapat diakses oleh:

ADMIN
22. Admin Dashboard

Route:

/admin

atau mengikuti existing route convention project.

Role: Admin

Purpose

Memberikan overview operasional sistem.

Information
Total students
Active students
Total materials
Total questions
Total tryouts
Recent activities
System status
Actions
Manage students
Manage content
Manage questions
Manage tryouts
23. Admin Student Management

Route:

/admin/students

Role: Admin

Purpose

Mengelola user/student.

Information
Student name
Email
Registration date
Status
Latest activity
Latest performance
Actions
Search
Filter
View detail
Edit
Activate
Deactivate
TBD
Delete student
Reset password
Export data
View detailed activity

Permission final mengikuti User Roles & Permissions.

24. Admin Student Detail

Route:

/admin/students/[id]

Role: Admin

Purpose

Menampilkan detail student.

Information
Profile
Account status
Learning activity
Practice history
Tryout history
Performance
Competency
Actions

Sesuai permission Admin.

25. Admin System Management

Jika terdapat fitur administrasi sistem, page dapat mencakup:

/admin/users
/admin/roles
/admin/settings

Namun page tersebut belum dianggap final sebelum kebutuhan system administration didefinisikan.

26. Content Manager Pages

Directory:

app/
└── content_manager/

Seluruh halaman di bawah area ini hanya dapat diakses oleh:

CONTENT_MANAGER

Permission harus mengikuti:

04. User & Role/04. Content Manager Requirements

27. Content Manager Dashboard

Route:

/content_manager

Role: Content Manager

Purpose

Memberikan overview pengelolaan konten.

Information
Total materials
Total questions
Total tryouts
Draft content
Published content
Content awaiting review
Recent updates
28. Material Management

Route:

/content_manager/materials

Role: Content Manager

Purpose

Mengelola materi pembelajaran.

Information
Title
Category
Difficulty
Status
Author
Created date
Updated date
Actions
Create
View
Edit
Preview
Publish
Unpublish
Archive
Content Lifecycle
DRAFT
  ↓
REVIEW
  ↓
PUBLISHED
  ↓
ARCHIVED
29. Material Editor

Route:

/content_manager/materials/create
/content_manager/materials/[id]/edit

Role: Content Manager

Purpose

Membuat dan mengedit material.

Information
Title
Description
Category
Difficulty
Learning objectives
Content
Related competency
Related practice
Actions
Save draft
Preview
Submit/review
Publish
30. Question Bank Management

Route:

/content_manager/questions

Role: Content Manager

Purpose

Mengelola question bank.

Information
Question
Question type
Difficulty
Competency
Status
Author
Actions
Search
Filter
Create
Edit
Preview
Publish
Archive
Delete
Question Requirements

Untuk current tryout requirement:

Difficulty
├── Level 1
├── Level 2
├── Level 3
├── Level 4
└── Level 5

Answer
└── 5 choices
31. Question Editor

Route:

/content_manager/questions/create
/content_manager/questions/[id]/edit

Role: Content Manager

Information

Minimal:

Question
Question type
Choices
Correct answer
Explanation
Difficulty
Competency
Related material
Status
Actions
Save draft
Preview
Publish
Archive

Correct answer tidak boleh diekspos kepada student pada active tryout session.

32. Tryout Management

Route:

/content_manager/tryouts

Role: Content Manager

Purpose

Mengelola tryout.

Information
Tryout title
Description
Question count
Duration
Difficulty configuration
Status
Availability
Actions
Create
Edit
Configure
Assign questions
Preview
Publish
Unpublish
Archive
33. Tryout Editor

Route:

/content_manager/tryouts/create
/content_manager/tryouts/[id]/edit
Information
Title
Description
Instructions
Duration
Question configuration
Availability
Scoring configuration
Adaptive configuration
Question Configuration

Tryout current requirement:

30 Questions
      ↓
5 Choices / Question
      ↓
5 Difficulty Levels
      ↓
Adaptive Selection
34. News Management

Route:

/content_manager/news

Role: Content Manager

Information
Title
Thumbnail
Content
Author
Publish date
Status
Actions
Create
Edit
Preview
Publish
Unpublish
Archive
35. Documentation Management

Route:

/content_manager/documentation
Information
Title
Category
Content
Author
Status
Updated date
Actions
Create
Edit
Preview
Publish
Unpublish
Archive
36. Testimonial Management

Route:

/content_manager/testimonials
Information
Name
Role / description
Testimonial
Photo
Status
Actions
Create
Edit
Preview
Publish
Unpublish
Archive
37. Tutorial Management

Route:

/content_manager/tutorials
Information
Title
Description
Content
Thumbnail
Video/media
Status
Actions
Create
Edit
Preview
Publish
Unpublish
Archive
38. Page Access Matrix
Page Area	Guest	Student	Admin	Content Manager
Public	✓	✓	✓	✓
Authentication	✓	✓	✓	✓
Dashboard	-	✓	✓	✓
Student	-	✓	-	-
Admin	-	-	✓	-
Content Manager	-	-	-	✓

Permission dapat diperluas jika role tertentu membutuhkan read-only access terhadap area tertentu. Hal tersebut harus mengikuti dokumen User Roles & Permissions.

39. Page State Requirements

Setiap page yang mengambil data dari backend minimal harus menangani:

Loading
Empty
Error
Success
Not Found
Unauthorized
Forbidden
Loading
Request
  ↓
Loading
  ↓
Content
Empty
Request Success
      ↓
No Data
      ↓
Empty State
Error
Request
  ↓
Error
  ↓
Error State
  ↓
Retry
Unauthorized
Protected Page
      ↓
Authentication Check
      ↓
Not Authenticated
      ↓
Login
Forbidden
Authenticated
      ↓
Role / Permission Check
      ↓
Forbidden

Contoh:

Student
  ↓
/admin
  ↓
403 Forbidden
40. Page Responsibility

Page requirement harus membedakan antara:

Page
  ↓
Container
  ↓
Atomic UI

Frontend implementation mengikuti architecture existing project.

Container

Bertanggung jawab terhadap:

Client state
API interaction
Query/mutation
Business flow
Navigation
Event handlers
Loading
Error handling
Page / Template / Organism / Molecule / Atom

Bertanggung jawab terhadap presentation dan composition.

Strict Client Rule

Untuk interactive authentication dan application flow:

'use client'

hanya berada pada Container sesuai frontend architecture project.

UI components tidak boleh mengambil alih business logic Container.

41. Page-to-Feature Mapping
Role	Page	Feature
Public	Beranda	Public
Public	Materi	Learning
Student	Dashboard	Dashboard
Student	Belajar	Learning
Student	Material Detail	Learning
Student	Latihan	Practice
Student	Practice Session	Practice
Student	Practice Result	Practice
Student	Tryout	Tryout
Student	Tryout Detail	Tryout
Student	Tryout Session	Tryout
Student	Tryout Result	Tryout
Student	Evaluasi	Evaluation
Student	Kompetensi	Evaluation
Student	Rekomendasi	Recommendation
Student	Profile	Profile
Admin	Dashboard	Administration
Admin	Students	User Management
Content Manager	Dashboard	Content Management
Content Manager	Materials	Learning Content
Content Manager	Questions	Question Bank
Content Manager	Tryouts	Tryout Management
Content Manager	News	CMS
Content Manager	Documentation	CMS
Content Manager	Testimonials	CMS
Content Manager	Tutorials	CMS
42. Recommended Route Structure

Target route structure:

/
├── login
├── register
├── forgot-password
├── verify-otp
├── reset-password
│
├── dashboard
│
├── student
│   ├── belajar
│   │   ├── rekomendasi
│   │   └── [slug]
│   │
│   ├── latihan
│   │   └── [id]
│   │       └── hasil
│   │
│   ├── tryout
│   │   └── [id]
│   │       ├── session
│   │       └── hasil
│   │
│   ├── evaluasi
│   │   ├── kompetensi
│   │   └── rekomendasi
│   │
│   └── profile
│
├── admin
│   ├── students
│   │   └── [id]
│   │
│   └── ...
│
└── content_manager
    ├── materials
    │   ├── create
    │   └── [id]/edit
    │
    ├── questions
    │   ├── create
    │   └── [id]/edit
    │
    ├── tryouts
    │   ├── create
    │   └── [id]/edit
    │
    ├── news
    ├── documentation
    ├── testimonials
    └── tutorials

Struktur route di atas adalah target logical structure. Sebelum implementasi, route harus disesuaikan dengan struktur existing repository agar tidak terjadi perubahan arsitektur yang tidak diperlukan.

43. Implementation Priority
P0 — Core MVP
Authentication
Login
Forgot Password
Verify OTP
Reset Password
Student
Dashboard
Belajar
Material Detail
Latihan
Practice Session
Practice Result
Tryout
Tryout Detail
Tryout Session
Tryout Result
Evaluasi
Kompetensi
Rekomendasi
Profile
Admin
Admin Dashboard
Students
Content Manager
Content Manager Dashboard
Materials
Questions
Tryouts
44. P1

Public:

Berita
Dokumentasi
Testimoni
Tutorial

Content Manager:

News Management
Documentation Management
Testimonial Management
Tutorial Management

Additional management features dapat ditambahkan setelah core learning flow selesai.

45. Definition of Done

Page dianggap siap diimplementasikan apabila:

[ ] Route sudah ditentukan
[ ] Role access sudah ditentukan
[ ] Purpose sudah jelas
[ ] Information yang ditampilkan sudah jelas
[ ] Primary action sudah jelas
[ ] Secondary action sudah jelas
[ ] Loading state sudah ditentukan
[ ] Empty state sudah ditentukan
[ ] Error state sudah ditentukan
[ ] Unauthorized state sudah ditentukan jika protected
[ ] Forbidden state sudah ditentukan jika role restricted
[ ] Dependency dengan backend sudah diketahui
[ ] Dependency dengan feature lain sudah diketahui

Untuk page interactive:

[ ] User flow sudah jelas
[ ] Submit flow sudah jelas
[ ] Success flow sudah jelas
[ ] Error flow sudah jelas
[ ] Navigation flow sudah jelas
46. Final Page Architecture

SIMANTIK menggunakan struktur:

                    SIMANTIK
                       │
          ┌────────────┼────────────┐
          │            │            │
       PUBLIC       AUTHENTICATION  PROTECTED
                                    │
                       ┌────────────┼────────────┐
                       │            │            │
                   DASHBOARD      STUDENT      MANAGEMENT
                                                  │
                                          ┌───────┴───────┐
                                          │               │
                                        ADMIN      CONTENT MANAGER

Student flow:

Dashboard
    ↓
Learning
    ↓
Practice
    ↓
Tryout
    ↓
Result
    ↓
Evaluation
    ↓
Recommendation
    ↓
Learning Again

Management flow:

Admin
  ↓
Students
  ↓
User Management
Content Manager
      ↓
Materials
Questions
Tryouts
Content
      ↓
Published Content
      ↓
Student Learning
47. Core Principle

Page/screen SIMANTIK harus mendukung learning loop utama:

LEARN
  ↓
PRACTICE
  ↓
TRYOUT
  ↓
RESULT
  ↓
EVALUATION
  ↓
RECOMMENDATION
  ↓
LEARN AGAIN

Halaman tidak hanya menampilkan data, tetapi harus membantu user memahami apa yang sedang terjadi dan tindakan berikutnya.

Khusus student:

Score bukan akhir dari flow.

Hasil assessment harus dapat mengarah ke:

Score
  ↓
Performance
  ↓
Competency
  ↓
Strength / Weakness
  ↓
Recommendation
  ↓
Learning Action

Dengan demikian Page & Screen Requirements menjadi penghubung antara:

Product Requirement
        ↓
Information Architecture
        ↓
User Flow
        ↓
Page Requirements
        ↓
UI/UX Design
        ↓
Frontend
        ↓
Backend
        ↓
QA

Jadi sekarang pembagiannya **role-first**, sesuai folder `app` kamu:

```text
app/
├── dashboard/          → Dashboard authenticated
├── student/            → Student
├── admin/              → Admin
└── content_manager/    → Content Manager

Sedangkan Atomic Design tetap berada di src/components dan tidak dicampur dengan struktur route/page. Ini lebih konsisten dengan arsitektur project kamu.
````
