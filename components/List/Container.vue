<script lang="ts" setup>
import draggable from "vuedraggable";
import type { ListDocument } from "~/server/models/List.model";

interface Props {
  boardName: string;
  boardId: string;
  lists: ListDocument[];
}

const props = defineProps<Props>();

// ketika me draggable maka akan manggil function ini
async function handleSort(e: any) {
  await useFetch(`/api/boards/${props.boardId}`, {
    method: "PUT",
    body: {
      name: props.boardName,
      lists: props.lists.flatMap((i: any) => i._id),
    },
  });
}
</script>
<template>
  <div>
    <draggable
      :list="lists"
      handle=".list-header"
      ghost-class="ghost-board"
      drag-class="dragging-board"
      item-key="_id"
      :scroll-sensitivity="500"
      :force-fallback="true"
      @sort="handleSort"
      class="flex h-[80vh] overflow-x-auto gap-4 pb-2 list"
    >
      <template #item="{ element }">
        <div class="flex">
          <ListItem :list="element" :board-id="boardId" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<style>
.ghost-board > div {
  @apply opacity-50;
}
.ghost-board > div > div {
  @apply invisible;
}

.dragging-board {
  @apply shadow-2xl transform rotate-2 cursor-grabbing;
}

.list .sortable-chosen {
  overflow: hidden;
  opacity: 1 !important;
}
</style>
