import BoardSchema from "~/schemas/Board.schema";
import { Board } from "~/server/models/Board.model";

export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, "boardId");
  const user = event.context.user;

  const body = await readBody(event);
  try {
    BoardSchema.parse(body); // Ini akan melempar error jika validasi gagal
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
  const board = await Board.updateOne(
    { _id: boardId, owner: user._id },
    {
      $set: body,
    }
  );
  return board;
});