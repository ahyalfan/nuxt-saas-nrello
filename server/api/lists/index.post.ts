import ListSchema from "~/schemas/List.schema";
import { Board } from "~/server/models/Board.model";
import { List } from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  try {
    ListSchema.parse(data); // Ini akan melempar error jika validasi gagal
  } catch (e: any) {
    let errorsFilter: any[] = [];
    e.errors.forEach((err: any) => {
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

  const user = event.context.user;

  const list = await List.create({
    ...data,
    owner: user._id,
  });

  if (!list) {
    throw createError({
      statusCode: 400,
      message: "Something went wrong",
    });
  }

  await Board.findOneAndUpdate(
    {
      _id: data.board,
      owner: user._id,
    },
    {
      // lists: {
      //   $each: [list._id],
      //   $position: 0,
      // },
      $push: { lists: list._id },
    },
    {
      new: true,
    }
  );

  return list;
});