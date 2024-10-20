import CardSchema from "~/schemas/Card.schema";
import { Card } from "~/server/models/Card.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;
  const listId = getRouterParam(event, "listId");
  const cardId = getRouterParam(event, "cardId");

  try {
    CardSchema.parse(body); // Ini akan melempar error jika validasi gagal
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

  const updatedCard = await Card.findOneAndUpdate(
    {
      _id: cardId,
      owner: user._id,
    },
    { $set:body },
    { new: true }
  );
  if (!updatedCard) {
    throw createError({
      statusCode: 404,
      message: "Card not found",
    });
  }

  return updatedCard;
});