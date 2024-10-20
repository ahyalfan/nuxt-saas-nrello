import ListSchema from "~/schemas/List.schema";
import { List } from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  const listId = getRouterParam(event, "listId");
  const user = event.context.user;

  const body = await readBody(event);

  try {
    ListSchema.parse(body); // Ini akan melempar error jika validasi gagal
  } catch (e: any) {
    let errorsFilter: any[] = [];
    e.errors.forEach((err: any) => {
      errorsFilter.push({
        field: err.path[0],
        message: err.message,
      });
    });
    console.log(errorsFilter)
    return {
      statusCode: 400,
      body: {
        message: "Validation failed",
        errors: errorsFilter, // Zod memberikan array error yang jelas
      },
    };
  }

  const updatedLists = await List.findOneAndUpdate(
    { _id: listId, owner: user._id },
    {
      $set: body,
    },
    {
      new: true,
    }
  );

  if (!updatedLists) {
    throw createError({
      statusCode: 404,
      message: "List not found",
    });
  }

  return updatedLists;
});