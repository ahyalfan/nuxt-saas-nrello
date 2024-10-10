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

const handleSubmit = async () => {
  try {
    errors.email.message = ""; // Reset errors
    errors.password.message = ""; // Reset errors
    await SigninSchema.parseAsync(form); // Validasi
    // Jika validasi berhasil, lakukan proses pendaftaran
    console.log("Form data is valid!", form);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err: any) => {
        if (err.path[0] == "email") {
          errors.email.message = err.message;
          errors.email.show = true;
        }
        if (err.path[0] == "password") {
          errors.password.message = err.message;
          errors.password.show = true;
        }
        errors.e = true;
        // masih sapai disini dan untuk realtime validasi juga belum.
      });
    }
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
      <NuxtLink to="/auth/signup" class="text-primary-500"> Sign Up </NuxtLink>
    </template>
    <el-form :model="form" label-width="auto" @submit.prevent style="max-width: 600px">
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
        <el-button type="primary" @click="handleSubmit" :disabled="errors.e"
          >Login</el-button
        >
      </el-form-item>
    </el-form>
  </WrapperAuth>
</template>

<style></style>
