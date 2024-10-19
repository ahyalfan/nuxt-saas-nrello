<script lang="ts" setup>
import { FormInstance } from "~/node_modules/element-plus/es/components/form/index";
import type { ListDocument } from "~/server/models/List.model";

interface Props {
  type: "create" | "update";
  boardId: string;
  initialData?: ListDocument;
  onCreate?: (data?: any) => void;
  onUpdate?: (data?: any) => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "create",
  initialData: undefined,
});

const isLoading = ref(false);
const formState = reactive<Partial<ListDocument>>({
  name: undefined,
  board: props.boardId,
});
const formRef = ref<FormInstance>();
const formRules = reactive({
  name: [
    {
      required: true,
      message: "Please input your name",
      trigger: "blur",
    },
  ],
});

watchEffect(() => {
  if (props.type === "update" && props.initialData) {
    formState.name = props.initialData.name;
    formState.board = props.initialData.board;
  }

  if (props.type === "create") {
    formState.name = undefined;
  }
});

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: any) => {
    if (valid) {
      try {
        isLoading.value = true;

        if (props.type === "update" && props.initialData) {
          formState.board = props.initialData.board;

          await useFetch(`/api/lists/${props.initialData._id}`, {
            method: "PUT",
            body: JSON.stringify(formState),
          });
          ElNotification({
            title: "list updated",
            message: "Your list has been update",
            type: "success",
            position: "top-left",
          });
          props.onCreate?.();
          return;
        }

        await useFetch("/api/lists", {
          method: "POST",
          body: JSON.stringify(formState),
        });

        ElNotification({
          title: "list created",
          message: "Your list has been created",
          type: "success",
          position: "top-left",
        });
        props.onCreate?.();
        formEl?.resetFields();
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
</script>

<template>
  <div>
    <div>
      <el-form
        ref="formRef"
        :model="formState"
        label-width="1px"
        @submit.prevent
        style="max-width: 600px; min-width: 100px"
      >
        <el-form-item
          label="List Name"
          label-position="top"
          class="w-full"
          prop="name"
          :rules="formRules.name"
        >
          <el-input v-model="formState.name" placeholder="List Name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isLoading" @click="handleSubmit(formRef)">
            {{ type === "create" ? "Create list" : "Update list" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style></style>
