<script lang="ts" setup>
import draggable from "vuedraggable";
import type { ListDocument } from "~/server/models/List.model";
import { Plus, DocumentAdd, DeleteFilled } from "@element-plus/icons-vue";
import type { CardDocument } from "~/server/models/Card.model";

const props = defineProps<{
  list: ListDocument;
  boardId: string;
}>();

const { destroy, update } = useList();
const showCreateCard = ref(false);
const selectedCard = ref<CardDocument | undefined>();

const refreshBoard = inject("refresh-board") as () => void;

const listActions = ref([
  {
    label: "Add card",
    icon: markRaw(DocumentAdd),
    click: () => {
      showCreateCard.value = true;
    },
  },
  {
    label: "Delete list",
    icon: markRaw(DeleteFilled),
    click: () => {
      destroy(props.list._id, refreshBoard);
    },
  },
]);

const { data, refresh } = await useFetch<CardDocument[]>(
  `/api/lists/${props.list._id}/cards`
);

const { update: updateCard } = useCard();

// setiap dia dirubah ke tempat drag lainya
// maka akan melakukan function ini
async function handleCardChange(e: any) {
  try {
    if (e.added) {
      const { element: card } = e.added;
      await updateCard(props.list._id, card._id, {
        title: card.title,
        list: props.list._id,
      });
    }
    // ini jika hanya merubah di tempat dragnya
    // maka akan melakukan sorting
    await update(props.list._id, {
      name: props.list.name,
      board: props.list.board,
      cards: data.value?.flatMap((item) => item._id),
    });
  } catch (e: any) {
    ElNotification({
      title: "Error",
      message: e.message || "Something went wrong",
      type: "error",
      position: "top-left",
    });
  }
}

function handleShowCard(card: CardDocument) {
  selectedCard.value = card;
  showCreateCard.value = true;
}

watch(showCreateCard, (value: boolean) => {
  if (!value) {
    selectedCard.value = undefined;
  }
});
</script>
<template>
  <div
    class="w-72 flex-none shadow dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 list flex flex-col"
  >
    <!-- List Header  -->
    <div
      class="list-header p-2 border-b dark:border-gray-700 flex items-center justify-between cursor-grab"
    >
      <h3 class="font-medium">{{ list.name }}</h3>

      <div class="ml-auto">
        <!-- dropdown -->
        <el-dropdown trigger="click">
          <span class="el-dropdown-link"> <IconSetting class="w-5 text-black" /> </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in listActions"
                :key="index"
                :icon="item?.icon"
                @click="item?.click && item?.click()"
                class="lg:min-w-48"
              >
                <span>{{ item.label }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- ./ List Header  -->

    <!-- List Body  -->

    <draggable
      v-if="data"
      :list="data"
      item-key="_id"
      group="list"
      :scroll-sensitivity="500"
      :force-fallback="true"
      ghost-class="ghost-card"
      drag-class="dragging-card"
      class="list-body p-2 space-y-2 flex-1 overflow-y-auto"
      @change="handleCardChange"
    >
      <template #item="{ element }">
        <div>
          <ListCard :card="element" @click="() => handleShowCard(element)" />
        </div>
      </template>
    </draggable>

    <!-- ./ List Body  -->

    <!-- List Footer -->
    <div
      class="list-footer border-t dark:border-gray-700 flex items-center justify-between"
    >
      <div
        class="flex p-1 text-green-700 justify-center items-center gap-2 w-full hover:cursor-pointer hover:bg-green-100"
        @click="showCreateCard = true"
      >
        Add card <el-icon><Plus /></el-icon>
      </div>
    </div>
    <!-- ./ List Footer  -->

    <Teleport to="body">
      <el-dialog
        v-model="showCreateCard"
        :title="selectedCard ? 'Update board' : 'Create board'"
        width="600"
        align-center
      >
        <div class="px-4">
          <FormCard
            :list-id="list._id"
            :type="selectedCard ? 'update' : 'create'"
            :initial-data="selectedCard"
            :on-create="
              () => {
                showCreateCard = false;
                refresh();
              }
            "
            :on-update="
              () => {
                showCreateCard = false;
                selectedCard = undefined;
                refresh();
              }
            "
          ></FormCard>
        </div>
      </el-dialog>
    </Teleport>
  </div>
</template>

<style scoped>
.ghost-card {
  @apply !bg-gray-100 dark:!bg-gray-700 rounded-lg;
}
.ghost-card > div {
  @apply invisible;
}

.dragging-card {
  @apply transform rotate-2 shadow-xl !cursor-grabbing;
}
.sortable-chosen {
  opacity: 1 !important;
  cursor: grabbing;
}
</style>
