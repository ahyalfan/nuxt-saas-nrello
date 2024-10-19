<script lang="ts" setup>
import { z } from "zod";
import SigninSchema from "~/schemas/Signin.schema";

useHead({
  title: "Signin",
});
// do not use same name with ref
const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);

const errors = reactive({
  e: false,
  email: {
    message: "",
    show: false,
  },
  password: {
    message: "",
    show: false,
  },
});

const { signIn } = useAuth();

const handleSubmit = async () => {
  try {
    loading.value = true; // Show loading spinner
    await SigninSchema.parseAsync(form); // Validasi
    // Jika validasi berhasil, lakukan proses pendaftaran
    console.log("Form data is valid!", form);
    const res: any = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (!res.error) {
      useRouter().push("/");
    } else {
      ElNotification({
        title: "Error",
        message: "sign in failed, please try again",
        type: "error",
        position: "top-left",
      });
    }
  } catch (error: any) {
    console.error("Form data is invalid:", error);
    ElNotification({
      title: "Error",
      message: "Form data is invalid",
      type: "error",
      position: "top-left",
    });
  } finally {
    form.password = "";
    loading.value = false; // Hide loading spinner
  }
};

watch(form, async () => {
  try {
    await SigninSchema.parseAsync(form);
    errors.e = false; // Reset error
    errors.email.show = false; // Reset error
    errors.password.show = false; // Reset error
  } catch (e: any) {
    e.errors.forEach((err: any) => {
      // errors.value[err.path[0]] = err.message; // Set error message
      switch (err.path[0]) {
        case "email":
          errors.email.message = err.message;
          errors.email.show = true;
          if (e.errors.length < 2) {
            errors.password.show = false;
          }
          break;
        case "password":
          errors.password.message = err.message;
          errors.password.show = true;
          if (e.errors.length < 2) {
            errors.email.show = false;
          }
          break;
        default:
          break;
      }
    });
  }
});
</script>
<template>
  <WrapperAuth title="Sign In to your account">
    <template #header>
      <span class="text-sm mr-px">Don't have an account?</span>
      <NuxtLink to="/auth/signup" class="text-green-700"> Sign Up </NuxtLink>
    </template>
    <el-form
      :model="form"
      label-width="1px"
      @submit.prevent
      style="max-width: 600px; min-width: 100px"
    >
      <el-form-item label="email" label-position="top" class="w-full">
        <el-input v-model="form.email" />
        <div v-if="errors.email.show" class="text-red-500">
          {{ errors.email.message }}
        </div>
      </el-form-item>
      <el-form-item label="password" label-position="top">
        <el-input type="password" placeholder="********" v-model="form.password" />
        <div v-if="errors.password.show" class="text-red-500">
          {{ errors.password.message }}
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
          :disabled="errors.e"
          :loading="loading"
          >Login</el-button
        >
      </el-form-item>
    </el-form>
  </WrapperAuth>
</template>

<style></style>
