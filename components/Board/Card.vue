<script lang="ts" setup>
import { BoardDocument } from "~/server/models/Board.model";
import { EditPen, Delete } from "@element-plus/icons-vue";
interface Props {
  board: BoardDocument;
  onEdit?: (board: BoardDocument) => void;
}
const props = defineProps<Props>();

const { destroy } = useBoard();
const refreshBoards = inject("refresh-boards") as () => void;

const actions = ref([
  {
    label: "Edit",
    icon: markRaw(EditPen),
    click: () => {
      props.onEdit?.(props.board);
    },
  },
  {
    divided: true,
    label: "Delete",
    icon: markRaw(Delete),
    click: () => destroy(props.board._id, refreshBoards),
  },
]);
</script>
<template>
  <div class="shadow dark:bg-gray-800 rounded-lg overflow-hidden relative">
    <div v-if="board.coverImage" class="h-36 w-full relative z-[1]">
      <NuxtImg
        :src="board.coverImage"
        :alt="board.name"
        class="h-full w-full absolute object-cover z-[1]"
      />
      <div
        class="absolute w-full h-full z-[2] bg-gradient-to-b from-black/90 to-transparent"
      ></div>
    </div>

    <div class="flex items-center gap-2 absolute left-0 z-10 top-0 py-2 px-4">
      <NuxtLink
        :to="{
          name: 'boardId',
          params: { boardId: board._id },
        }"
        class="block font-semibold text-white"
        >{{ board.name }}
      </NuxtLink>

      <!-- dropdown -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <IconSetting class="w-5 text-white" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in actions"
              :divided="item?.divided"
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
</template>

<style></style>
