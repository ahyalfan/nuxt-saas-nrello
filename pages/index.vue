<script lang="ts" setup>
import { BoardDocument } from "~/server/models/Board.model";

definePageMeta({
  middleware: "auth",
});
useHead({
  title: "Boards",
});
const { data, error, refresh } = await useFetch<BoardDocument[]>("/api/boards");
provide("refresh-boards", refresh);

if (error.value) {
  throw createError(error.value);
}

const showCreateBoard = ref(false);
const selectedBoard = ref<BoardDocument | undefined>();

async function handleEdit(board: BoardDocument) {
  selectedBoard.value = board;
  showCreateBoard.value = true;
}

watchEffect(() => {
  if (!showCreateBoard.value) {
    selectedBoard.value = undefined;
  }
});
</script>
<template>
  <WrapperDefault>
    <h1 class="tex-2xl font-semibold">Boards</h1>

    <template #actions>
      <el-button color="#22c55e" size="small" @click="showCreateBoard = !showCreateBoard">
        <span class="text-white">Create new board</span>
      </el-button>
    </template>
    <el-drawer
      size="360"
      v-model="showCreateBoard"
      :title="selectedBoard ? 'Update board' : 'Create board'"
      :with-header="true"
    >
      <FormBoard
        :type="selectedBoard ? 'update' : 'create'"
        :initial-data="selectedBoard"
        :on-create="
          () => {
            showCreateBoard = false;
            refresh();
          }
        "
        :on-update="
          () => {
            showCreateBoard = false;
            selectedBoard = undefined;
            refresh(); // refresh dari boardsnya
          }
        "
      />
    </el-drawer>

    <!-- List of boards -->
    <section class="grid grid-cols-2 lg:grid-cols-5 my-4 gap-4">
      <BoardCard
        v-for="board in data"
        :key="board._id"
        :board="board"
        :on-edit="handleEdit"
      ></BoardCard>
      <!-- <BoardCard v-if="data.length === 0" :key="0" :board="{ _id: '', title: 'No boards found' }" /> -->
    </section>
    <!-- ./ List of boards -->
  </WrapperDefault>
</template>

<style></style>
