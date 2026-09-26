export default function ContentManagerTestimonialPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manajemen Testimonial</h1>
      <p className="text-slate-600 mb-8">
        Fitur pengelolaan kumpulan testimoni untuk public landing page.
      </p>

      <div className="border border-slate-200 bg-white rounded-2xl p-8 text-center text-slate-500">
        Modul Testimonial akan dirilis pada iterasi pembaruan CMS berikutnya. Endpoint backend (GET
        /api/v1/content/testimonials/admin) sudah tersedia.
      </div>
    </div>
  );
}
