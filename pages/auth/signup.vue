<script lang="ts" setup>
import type { FormInstance } from "element-plus";

useHead({
  title: "Signup",
});

const formRef = ref<FormInstance>();

const form = reactive({
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

const loading = ref(false);

const formRules = reactive({
  name: [
    {
      required: true,
      message: "Please input your name",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "Please input email address",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "Please input password",
      trigger: "blur",
    },
    {
      min: 8,
      message: "Password must be at least 8 characters",
      trigger: ["blur", "change"],
    },
  ],
  passwordConfirm: [
    {
      required: true,
      message: "Please input password again",
      trigger: "blur",
    },
    {
      message: "Two inputs don't match!",
      trigger: "blur",
      validator: (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("Please input the password again"));
        } else if (value !== form.password) {
          callback(new Error("Two inputs don't match!"));
        } else {
          callback();
        }
      },
    },
  ],
});

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: any) => {
    if (valid) {
      try {
        loading.value = true;
        const res = await useFetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(form), // Mengubah form menjadi string JSON
          headers: {
            "Content-Type": "application/json", // Menyatakan bahwa data yang dikirim adalah JSON
          },
        });
        ElNotification({
          title: "Account created",
          message: "Your account has been created successfully",
          type: "success",
          position: "top-left",
        });
        await useRouter().push({
          name: "auth-signin",
        });
      } catch (error) {
        ElNotification({
          title: "Error",
          message: "Form data is invalid",
          type: "error",
          position: "top-left",
        });
      } finally {
        loading.value = false;
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
  <WrapperAuth title="Create an account for free">
    <template #header>
      <span class="text-sm mr-px">Already have an account?</span>
      <NuxtLink to="/auth/signin" class="text-green-700"> Sign In </NuxtLink>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      label-width="1px"
      @submit.prevent
      style="max-width: 600px; min-width: 100px"
    >
      <el-form-item
        label="name"
        label-position="top"
        class="w-full"
        prop="name"
        :rules="formRules.name"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item
        label="email"
        label-position="top"
        class="w-full"
        prop="email"
        :rules="formRules.email"
      >
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item
        label="password"
        label-position="top"
        prop="password"
        :rules="formRules.password"
      >
        <el-input type="password" placeholder="********" v-model="form.password" />
      </el-form-item>
      <el-form-item
        label="Confirm Password"
        label-position="top"
        prop="passwordConfirm"
        :rules="formRules.passwordConfirm"
      >
        <el-input type="password" placeholder="********" v-model="form.passwordConfirm" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit(formRef)"
          >Sign Up</el-button
        >
      </el-form-item>
    </el-form>
  </WrapperAuth>
</template>

<style></style>
