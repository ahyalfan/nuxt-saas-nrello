import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema, model } from "mongoose";
import type { Document } from "mongoose";

export interface BoardDocument extends Document {
  name: string;
  lists: string[];
  owner: string;
  coverImage: string;
}

const boardSchema = defineMongooseModel<BoardDocument>({
    name: 'Board',
    schema: {
        name: {
          type: String,
          default: "Untitled Board",
        },
        lists: [
          {
            type: Schema.Types.ObjectId,
            ref: "List",
          },
        ],
        owner: {
          type: Schema.Types.ObjectId as any,
          ref: "User",
        },
        coverImage: {
          type: String,
          default: "null",
        },
    },
    options: {
        timestamps: true,
    },
    hooks(schema) {
        
    }
});

export const Board = boardSchema;