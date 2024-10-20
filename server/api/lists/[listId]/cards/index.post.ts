import CardSchema from "~/schemas/Card.schema";
import { Card } from "~/server/models/Card.model";
import { List } from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;
  const listId = getRouterParam(event, "listId");

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
    return {
      statusCode: 400,
      body: {
        message: "Validation failed",
        errors: errorsFilter, // Zod memberikan array error yang jelas
      },
    };
  }

  const card = await Card.create({
    ...body,
    list: listId,
    owner: user._id,
  });

  // Save the card to the list
  await List.findByIdAndUpdate(listId, {
    // To the front of the list
    $push: { cards: { $each: [card._id], $position: 0 } },
  });

  event.node.res.statusCode = 201;

  return card;
});