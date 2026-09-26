export default function ContentManagerDocsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manajemen Dokumentasi</h1>
      <p className="text-slate-600 mb-8">
        Fitur pengelolaan pusat bantuan & dokumentasi panduan platform.
      </p>

      <div className="border border-slate-200 bg-white rounded-2xl p-8 text-center text-slate-500">
        Modul Dokumentasi akan dirilis pada iterasi pembaruan CMS berikutnya. Endpoint backend (GET
        /api/v1/content/documentation/admin) sudah tersedia.
      </div>
    </div>
  );
}
