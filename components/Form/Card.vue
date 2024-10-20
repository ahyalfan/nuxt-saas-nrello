<script lang="ts" setup>
import { FormInstance } from "~/node_modules/element-plus/es/components/form/index";
import type { CardDocument } from "~/server/models/Card.model";
import { Delete } from "@element-plus/icons-vue";

interface Props {
  type: "create" | "update";
  listId: string;
  initialData?: Partial<CardDocument>;
  onCreate?: () => void;
  onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "create",
});

const isLoading = ref(false);
const formState = reactive<Partial<CardDocument>>({
  title: undefined,
  description: undefined,
  list: props.listId,
  imgUrl: [],
});

const formRef = ref<FormInstance>();
const formRules = reactive({
  title: [
    {
      required: true,
      message: "Please input your title",
      trigger: "blur",
    },
  ],
});

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: any) => {
    if (valid) {
      try {
        isLoading.value = true;

        if ((props.type === "update", props.initialData)) {
          await useFetch(`/api/lists/${props.listId}/cards/${props.initialData._id}`, {
            method: "PUT",
            body: JSON.stringify(formState),
            watch: false,
          });
          props.onUpdate?.();
          formEl?.resetFields();
          ElNotification({
            title: "Card update",
            message: "Your card has been update",
            type: "success",
            position: "top-left",
          });
          return;
        }

        await useFetch(`/api/lists/${props.listId}/cards`, {
          method: "POST",
          body: JSON.stringify(formState),
          watch: false,
        });
        props.onCreate?.();
        formEl?.resetFields();
        ElNotification({
          title: "Card created",
          message: "Your card has been created",
          type: "success",
          position: "top-left",
        });
      } catch (error) {
        ElNotification({
          title: "Error",
          message: "Form data is invalid",
          type: "error",
          position: "top-left",
        });
      } finally {
        isLoading.value = false;
      }
    } else {
      ElNotification({
        title: "Error",
        message: "Form data is invalid",
        type: "error",
        position: "top-left",
      });
    }
  });
};

async function handleDelete() {
  try {
    isLoading.value = true;
    await useFetch(`/api/lists/${props.listId}/cards/${props.initialData?._id}`, {
      method: "DELETE",
      watch: false,
    });
    props.onUpdate?.();
    ElNotification({
      title: "Card deleted",
      message: "Your card has been deleted",
      type: "success",
      position: "top-left",
    });
  } catch (e: any) {
    ElNotification({
      title: "Error",
      message: e.message || "Something went wrong",
      type: "error",
      position: "top-left",
    });
  } finally {
    isLoading.value = false;
  }
}

watchEffect(() => {
  if (props.type === "update" && props.initialData) {
    formState.title = props.initialData.title;
    formState.description = props.initialData.description;
  }

  if (props.type === "create") {
    formState.title = undefined;
    formState.description = undefined;
  }
});
</script>
<template>
  <div>
    <el-form
      ref="formRef"
      :model="formState"
      label-width="1px"
      @submit.prevent
      style="max-width: 600px; min-width: 100px"
    >
      <el-form-item
        label="Title"
        label-position="top"
        class="w-full"
        prop="title"
        :rules="formRules.title"
      >
        <el-input v-model="formState.title" placeholder="Title" />
      </el-form-item>
      <el-form-item label="Description" label-position="top" class="w-full">
        <ClientOnly>
          <QuillEditor
            v-model:content="formState.description"
            theme="snow"
            toolbar="minimal"
            content-type="html"
          />
        </ClientOnly>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="type === 'update'"
          :loading="isLoading"
          @click="handleDelete"
          type="danger"
          :icon="Delete"
          circle
        />
        <el-button type="primary" :loading="isLoading" @click="handleSubmit(formRef)">
          {{ type === "create" ? "Create board" : "Update board" }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.ql-container {
  @apply h-32 rounded-b-lg shadow w-full;
}
.ql-toolbar {
  @apply rounded-t-lg;
}
</style>
