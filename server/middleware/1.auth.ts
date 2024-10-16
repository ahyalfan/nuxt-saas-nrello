// alasan disini prefix buat middlewarenya ada 1
// adalah, jika kita pakai nuxt maka middleware nya ada lebih dari satu maka dia akan mendeteksi yang paling atas sendiri
// misala ada auth buat admin dan auth buat user doang
// maka 1.auth ini buat role biasa
// dan 2.auth ini buat role admin begitu lah intinya
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event); // kita ambill session dari hasil loginnya

  const protectedRoutes = ["/api/boards", "/api/lists", "/api/users"];
  // dia bakal melindungin router yg terdaftar diatas

  // Di sini, Anda memeriksa apakah rute yang diminta saat ini adalah salah satu dari rute yang dilindungi.
  // Fungsi getRequestURL(event) digunakan untuk mendapatkan URL dari permintaan, dan.pathname.startsWith(route) memeriksa apakah URL tersebut cocok dengan salah satu rute yang dilindungi.
  const isProtectedRoute = protectedRoutes.some((route) =>
    getRequestURL(event).pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    // jika tidak ada salah satu diatas maka lanjutkan saja
    return;
  }

  // tapi jika ada salah satu diatas tapi belum ada session maka tampilkan error
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to access this resource",
    });
  }

  // kita masukin ke context buat diambil data user nanti, ini sama kayak context di golang sih
  event.context.user = session?.user; // ambil user dari sessionnya
});