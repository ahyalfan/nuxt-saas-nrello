
import BoardSchema from "~/schemas/Board.schema";
import { Board } from "~/server/models/Board.model";
import type { IUser  } from "~/server/models/User.model";

export default defineEventHandler(async (event) => {
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

  const user = event.context.user as IUser;

  const boardCount = await Board.countDocuments({ owner: user._id });

  // if (boardCount >= 1 && !user.hasActiveSubscription) {
  //   throw createError({
  //     statusCode: 403,
  //     message:
  //       "You can't create more than 1 boards in free plan. Please upgrade your plan to create unlimited",
  //   });
  // }

  const board = await Board.create({
    ...body,
    owner: user._id,
  });

  return board;
});