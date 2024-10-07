import { Schema, model, Document } from 'mongoose'

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    stripeCustomerId?: string;
//       subscription: {
//     id: string;
//     status: string;
//     priceId: string;
//   };
//   hasActiveSubscription: boolean;
  comparePassword: (password: string) => Promise<boolean>;
//   updateSubscription: (data: Stripe.Subscription) => Promise<void>;

}

const userSchema = new Schema<any>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    // subscription: {
    //   id: {
    //     type: String,
    //     default: null,
    //   },
    //   status: {
    //     type: String,
    //     default: null,
    //   },
    //   priceId: {
    //     type: String,
    //     default: null,
    //   },
    // },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    // },
  }
);

// ini dia bikin model buat database di mongo db
// menggunkan model dan schema user 
export const User = model<UserDocument>("User", userSchema);