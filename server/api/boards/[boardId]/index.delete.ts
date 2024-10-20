import { Board } from "~/server/models/Board.model";
import { List } from "~/server/models/List.model";

export default defineEventHandler(async (event) => {
  // ambil path router id
  const boardId = getRouterParam(event, "boardId");
  const user = event.context.user;

  const deletedBoard = await Board.findOneAndDelete({
    _id: boardId,
    owner: user._id,
  });

  if (!deletedBoard) {
    throw createError({
      statusCode: 404,
      message: "Board not found",
    });
  }

  // Delete all lists associated with the board
  await List.deleteMany({
    board: deletedBoard._id,
    owner: user._id,
  });

  event.node.res.statusCode = 204;

  return true;
});