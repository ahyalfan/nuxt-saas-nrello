<script lang="ts" setup>
import { BoardDocument } from "~/server/models/Board.model";
import type { FormInstance } from "element-plus";

interface Props {
  type: "create" | "update";
  initialData?: Partial<BoardDocument>;
  onUpdate?: (data?: any) => void;
  onCreate?: (data?: any) => void;
}

const porps = withDefaults(defineProps<Props>(), {
  type: "create",
});

const isLoading = ref(false);
const formState = reactive<Partial<BoardDocument>>({
  name: undefined,
  coverImage: undefined,
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

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: any) => {
    if (valid) {
      try {
        isLoading.value = true;

        const { data, error } = await useFetch("/api/boards", {
          method: "POST",
          body: JSON.stringify(formState),
          watch: false,
        });

        if (error.value) {
          if (error.value.statusCode === 403) {
            // useSubscription().showSubscriptionModal({
            //   title: "Multiple boards is a Premium Feature",
            //   description:
            //     "You can create only one board in free plan. Please upgrade to premium to create more boards.",
            // });
          }
        }

        porps.onCreate?.(data);
        ElNotification({
          title: "Board created",
          message: "Your board has been created",
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

watchEffect(() => {
  if (porps.type === "update" && porps.initialData) {
    formState.name = porps.initialData.name;
    formState.coverImage = porps.initialData.coverImage;
  }

  if (porps.type === "create") {
    formState.name = undefined;
    formState.coverImage = undefined;
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
        label="Board Name"
        label-position="top"
        class="w-full"
        prop="name"
        :rules="formRules.name"
      >
        <el-input v-model="formState.name" placeholder="Board Name" />
      </el-form-item>
      <el-form-item label="Cover Image" label-position="top" class="w-full">
        <el-input v-model="formState.coverImage" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit(formRef)">
          {{ type === "create" ? "Create board" : "Update board" }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style></style>
