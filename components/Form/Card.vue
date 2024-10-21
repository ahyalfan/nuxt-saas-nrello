<script lang="ts" setup>
import { FormInstance } from "~/node_modules/element-plus/es/components/form/index";
import type { CardDocument } from "~/server/models/Card.model";
import { Delete, Plus } from "@element-plus/icons-vue";

const {
  public: { imgurClientId },
} = useRuntimeConfig();

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
        const res = await uploadImage();
        console.log(res);

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
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const selectedFile = ref<File | null>(null);

watchEffect(() => {
  if (props.type === "update" && props.initialData) {
    formState.title = props.initialData.title;
    formState.description = props.initialData.description;
    formState.imgUrl = props.initialData.imgUrl;
  }

  if (props.type === "create") {
    formState.title = undefined;
    formState.description = "<span><span>";
    formState.imgUrl = [];
    selectedFile.value = null;
  }
});

const handlePictureCardPreview = (uploadFile: string) => {
  dialogImageUrl.value = uploadFile;
  dialogVisible.value = true;
};
const removeList = (e: string) => {
  if (confirm("Are you sure you want to delete this card?")) {
    dialogVisible.value = false;
    for (let i = formState?.imgUrl!.length - 1; i >= 0; i--) {
      if (formState.imgUrl![i] === e) {
        formState.imgUrl!.splice(i, 1);
      }
    }
  }
};
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    // validasi img from png or jpg or jpeg
    const validMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validMimeTypes.includes(target.files[0].type)) {
      ElNotification({
        title: "Error",
        message: "Only.png,.jpeg,.jpg images are allowed",
        type: "error",
        position: "top-left",
      });
      return;
    }

    // validasi ukuran gambar maksimal 2MB
    const validSize = 2 * 1024 * 1024; // 2MB
    if (target.files[0].size > validSize) {
      ElNotification({
        title: "Error",
        message: "Image size should not exceed 2MB",
        type: "error",
        position: "top-left",
      });
      return;
    }

    selectedFile.value = target.files[0];
  }
};
const uploadImage = async () => {
  if (!selectedFile.value) {
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile.value);
  selectedFile.value = null;
  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data' // Fetch API sets this automatically
        Authorization: `Client-ID ${imgurClientId}`,
      },
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    formState.imgUrl!.push(data?.data?.link);
  } catch (error) {
    console.error("Error uploading the image:", error);
  }
};
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

      <!-- img -->
      <div>
        <h2>Upload Image</h2>
        <input type="file" @change="onFileChange" />
        <div
          v-for="(img, index) in formState.imgUrl"
          :key="index"
          class="flex gap-4 flex-wrap my-2"
        >
          <el-avatar
            shape="square"
            @click="handlePictureCardPreview(img)"
            :size="100"
            fit="fill"
            :src="img"
            class="hover:cursor-pointer"
          />
        </div>
      </div>
      <!-- img end -->

      <el-form-item class="mt-4">
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

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
      <div slot="footer" class="text-center mt-2">
        <el-button type="danger" @click="removeList(dialogImageUrl)">Remove</el-button>
      </div>
    </el-dialog>
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
