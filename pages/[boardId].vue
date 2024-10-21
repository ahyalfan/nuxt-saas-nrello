<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board.model";
import type { ListDocument } from "~/server/models/List.model";

// midllware auth dari nuxt auth yg sudah kita tambahkan
definePageMeta({
  middleware: "auth",
});

const { boardId } = useRoute().params;
const showCreateList = ref(false);

const { data, refresh } = await useFetch<BoardDocument>(`/api/boards/${boardId}`);

provide("refresh-board", refresh);

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "Board not found",
  });
}

useHead({
  title: data.value.name,
});

onMounted(() => {
  ElMessage({
    message: "Warning, The image is only temporary, so check it regularly.",
    type: "warning",
  });
});

const coverImage = computed(() => data.value?.coverImage || "");
const lists = computed(() => data.value?.lists as ListDocument[]);
</script>
<template>
  <WrapperDefault
    v-if="data"
    class="h-screen"
    :style="{
      backgroundImage: `url(${coverImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <template #actions>
      <el-button color="#22c55e" size="small" @click="showCreateList = !showCreateList">
        <span class="text-white">Create a list</span>
      </el-button>
    </template>

    <h1 class="tex-3xl text-white font-semibold mb-4 inline-block">
      {{ data!.name }}
    </h1>

    <!-- list container -->
    <ListContainer
      :lists="lists"
      :board-id="(boardId as string)"
      :boardName="data!.name"
    />
    <!-- end list container -->

    <el-drawer
      size="360"
      v-model="showCreateList"
      title="Create list"
      :with-header="true"
    >
      <FormList
        type="create"
        :board-id="(boardId as string)"
        :on-create="
          () => {
            refresh();
            showCreateList = false;
          }
        "
        :on-update="
          () => {
            refresh();
            showCreateList = false;
          }
        "
        class="p-4"
      />
    </el-drawer>
  </WrapperDefault>
</template>

<style></style>
