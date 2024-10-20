import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema, model } from "mongoose";
import type { Document } from "mongoose";

export interface CardDocument extends Document {
   title: string;
    description: string;
    imgUrl?: string[]; // Pastikan imgurl ada di sini
  owner: string;
  list: string;
}

const cardSchema = defineMongooseModel<CardDocument>({
    name: 'Card',
    schema:{
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        description: {
            type: String,
            default: null,
        },
        imgUrl: {
            type: [Schema.Types.ObjectId as any],
            default: [],
        },
        owner: {
        type: Schema.Types.ObjectId as any,
        ref: "User",
        required: [true, "Owner is required"],
        },
        list: {
        type: Schema.Types.ObjectId as any,
        ref: "List",
        required: [true, "List is required"],
        },
    },
    options: {
        timestamps: true,
    },
    hooks(schema) {
        
    }
});

export const Card = cardSchema;