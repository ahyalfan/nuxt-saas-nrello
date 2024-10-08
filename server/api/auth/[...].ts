// NuxtAuthHandler: Merupakan fungsi dari Nuxt Auth yang menangani logika otentikasi.
// User: Merujuk ke model pengguna yang Anda definisikan di server, yang berfungsi untuk berinteraksi dengan basis data.
// CredentialsProvider: Penyedia untuk otentikasi berbasis kredensial (username dan password) dari NextAuth.
import { NuxtAuthHandler } from "#auth";
import { User } from "~/server/models/User.model";
import CredentialsProvider from "next-auth/providers/credentials";

async function getUser(id: string) {
  const user = await User.findById(id);

  return user?.toJSON();
}


export default NuxtAuthHandler({
  // secret: Mengambil rahasia untuk menandatangani token dari konfigurasi runtime. Ini penting untuk menjaga keamanan session JWT.
  secret: useRuntimeConfig().auth.secret,
  providers: [
    // bisa pakai github, dll
    // {
    //   name: "github",
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //   scope: ["read:user"],
    //   async getUser(access_token) {
    //     const response = await fetch("https://api.github.com/user", {
    //       headers: { Authorization: `Bearer ${access_token}` },
    //     });
    //     const user = await response.json();

    //     return {
    //       _id: user.id,
    //       name: user.name,
    //       email: user.email,
    //     };
    //   },
    // },
    // @ts-ignore
    CredentialsProvider.default({
// name: Menentukan nama penyedia yang akan ditampilkan dalam UI.
// origin: Mengambil origin dari konfigurasi runtime, sering digunakan untuk pengaturan CORS.
// authorize: Fungsi yang memproses kredensial yang diberikan oleh pengguna. Jika kredensial valid, pengguna akan diizinkan.
      name: 'credentials',
      origin: useRuntimeConfig().auth.origin,
      async authorize(credentials: {
        email: string,
        password: string,
      }) {
        // logic authentication
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          return null;
        }

        return user.toJSON();
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },

//   session: Mengatur strategi session yang digunakan. Di sini, strategy: 'jwt' berarti session akan dikelola menggunakan JSON Web Tokens.
// callbacks: Fungsi yang akan dipanggil pada berbagai tahap dalam siklus hidup otentikasi.
// async jwt: Fungsi ini dijalankan saat token JWT dihasilkan.
// Jika objek pengguna (user) ada, gabungkan data pengguna ke dalam token yang ada dan kembalikan token baru.
// async session: Fungsi ini dijalankan saat session dibuat.
// Mengambil pengguna terbaru berdasarkan ID dari token (token._id).
// Memperbarui session dengan data pengguna dan mengembalikan session yang diperbarui.

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          ...user
        }
      }
      return token;
    },

    async session({ session, token }) {
      // @ts-expect-error
      const refreshedUser = await getUser(token._id);

      session.user = {
        ...token,
        ...session.user,
        ...refreshedUser,
      };

      return session;
    },
  }
});


// bisa pakai ini juga, jika sudha setting di nuxt confignya
//  {
//       id: 'github',
//       name: 'GitHub',
//       type: 'oauth2',
//       authorization: 'https://github.com/login/oauth/authorize',
//       token: 'https://github.com/login/oauth/access_token',
//       userinfo: 'https://api.github.com/user',
//       clientId: useRuntimeConfig().auth.github.clientId,
//       clientSecret: useRuntimeConfig().auth.github.clientSecret,
//       scope: 'read:user',
//     },
