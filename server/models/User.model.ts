// import { Schema, model, Document } from 'mongoose'
// import bcrypt from "bcryptjs";
// import { generateHash } from '~/utils/hash';

// export interface UserDocument extends Document {
//     name: string;
//     email: string;
//     password: string;
//     stripeCustomerId?: string;
// //       subscription: {
// //     id: string;
// //     status: string;
// //     priceId: string;
// //   };
// //   hasActiveSubscription: boolean;
//   comparePassword: (password: string) => Promise<boolean>;
// //   updateSubscription: (data: Stripe.Subscription) => Promise<void>;

// }

// const userSchema = new Schema<any>(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//         unique: [true, "Email already exists"],
//         trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       select: false,
//     },
//     stripeCustomerId: {
//       type: String,
//       default: null,
//     },
//     // subscription: {
//     //   id: {
//     //     type: String,
//     //     default: null,
//     //   },
//         //   status: {
//     //     type: String,
//     //     default: null,
//     //   },
//     //   priceId: {
//     //     type: String,
//     //     default: null,
//     //   },
//     // },
//   },
//   {
//     timestamps: true,
//     // toJSON: {
//     //   virtuals: true,
//     // },
//   }
// );

// // Bagian ini adalah middleware Mongoose yang dijalankan sebelum dokumen disimpan ke database. Dalam hal ini, middleware dijalankan sebelum operasi save() pada model pengguna.
// // Tujuan: Untuk mengenkripsi password sebelum disimpan.
// // Fungsi:
// // if (!this.isModified("password")) return next();:
// // Memeriksa apakah field password telah diubah. Jika tidak ada perubahan, middleware melanjutkan ke fungsi berikutnya dengan memanggil next(), sehingga proses penyimpanan dapat dilanjutkan tanpa mengubah password.
// // this.password = await generateHash(this.password as string);:
// // Jika password telah diubah, password tersebut akan dienkripsi menggunakan fungsi generateHash() sebelum disimpan ke database. (Pastikan bahwa generateHash adalah fungsi yang sudah didefinisikan di tempat lain untuk melakukan hashing.)
// // next();:
// // Memanggil next() untuk melanjutkan ke operasi penyimpanan. Jika ada error dalam proses hashing, sebaiknya menangkap error tersebut dan memanggil next(error).
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
    
//     this.password = await generateHash(this.password as string);

//     // intinya ini akan melakukan ini sebelum menyimpan ke databse
//   next();
// });

// // method buat mbandingin password
// userSchema.methods.comparePassword = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };

// // ini dia bikin model buat database di mongo db
// // menggunkan model dan schema user 
// export const User = model<UserDocument>("User", userSchema);


// ini jika kita pakai nuxt-mongose
// tapi jika tidak pakai nuxt-mongose bisa pakai cara diatas, itu cara paling generalnya
import { defineMongooseModel } from '#nuxt/mongoose';
import bcrypt from 'bcryptjs';
import { generateHash } from '~/utils/hash';
import { Document } from 'mongoose';

class IUser extends Document {
  email!: string;
  password!: string;
  name!: string;
  stripeCustomerId: string | null = null;
  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

const UserSchema = defineMongooseModel<IUser>({
  name: 'User',
  schema: {
    email: {
      type: 'string',
      unique: true,
      required: true,
    },
    password: {
      type: 'string',
      required: true,
      select: false, // tidak akan mengembalikan password secara default
      },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    },
  options: {
    timestamps: true,
  },
  hooks(schema) {
    schema.pre('save', async function (next) {
      if (!this.isModified('password')) return next();
      this.password = await generateHash(this.password);
      next();
    });
  },
});


export const User = UserSchema;