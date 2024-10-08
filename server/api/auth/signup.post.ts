import SignupSchema from '~/schemas/Signup.schema';
import { User } from "~/server/models/User.model";

// api/auth/signup dengan method post
// ini akan digenerate oleh nuxt server utils
export default defineEventHandler(async (event) => {
  // dengan readBody kita bisa ambil event http post 
  // atau jika multipart bisa juga
  // readFormData
  // readMultipartFormData
  // dan lain lain bisa di explore
  const data = await readBody(event);
  // Validasi data menggunakan Zod
  try {
    SignupSchema.parse(data); // Ini akan melempar error jika validasi gagal
  } catch (e: any) {
    let errorsFilter: any[] = [];
    e.errors.forEach( (err: any)  => {
      errorsFilter.push({
        field: err.path[0],
        message: err.message,
      });
    });
    return {
      statusCode: 400,
      body: {
        message: "Validation failed",
        errors: errorsFilter, // Zod memberikan array error yang jelas
      },
    };
  }
  const user = await User.create(data);
  return user;
})