import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema, model } from "mongoose";
import type { Document } from "mongoose";
import { CardDocument } from './Card.model';

export interface ListDocument extends Document {
 name: string;
  cards: string[] | CardDocument[];
  board: string;
  owner: string;
}

const listSchema = defineMongooseModel<ListDocument>({
    name: 'List',
    schema:{
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        cards: [
            {
                type: Schema.Types.ObjectId,
                ref: "Card",
            },
        ],
        board: {
            type: Schema.Types.ObjectId as any,
            ref: "Board",
        },
        owner: {
            type: Schema.Types.ObjectId as any,
            ref: "User",
        },
    },
    options: {
        timestamps: true,
    },
    hooks(schema) {
        
    }
});

export const List = listSchema;