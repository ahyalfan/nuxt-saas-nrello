<script lang="ts" setup>
import Email from "next-auth/providers/email";
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
  email: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    errors.email = ""; // Reset errors
    errors.password = ""; // Reset errors
    await SigninSchema.parseAsync(form); // Validasi
    // Jika validasi berhasil, lakukan proses pendaftaran
    console.log("Form data is valid!", form);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err: any) => {
        if (err.path[0] == "email") {
          errors.email = err.message;
        }
        if (err.path[0] == "password") {
          errors.password = err.message;
        }
        // masih sapai disini dan untuk realtime validasi juga belum.
      });
    }
  }
};

watch(form, async () => {
  try {
    await SigninSchema.parseAsync(form);
  } catch (e: any) {
    e.errors.forEach((err: any) => {
      console.log(err);
      // errors.value[err.path[0]] = err.message; // Set error message
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
        <div v-if="true" class="text-red-500">{{ errors.email }}</div>
      </el-form-item>
      <el-form-item label="password" label-position="top">
        <el-input type="password" placeholder="********" v-model="form.password" />
        <div v-if="true" class="text-red-500">{{ errors.password }}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="false" :disabled="false"
          >Login</el-button
        >
      </el-form-item>
    </el-form>
  </WrapperAuth>
</template>

<style></style>
