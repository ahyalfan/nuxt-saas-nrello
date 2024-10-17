<script lang="ts" setup>
import type { IUser } from "~/server/models/User.model";
const { data, signOut } = useAuth();
import { Money, CloseBold } from "@element-plus/icons-vue";
const dropdownItems = ref([
  {
    label: "Profile",
    disabled: true,
    divided: false,
  },

  {
    label: "Billing",
    icon: Money,
    divided: true,
    // click: accessPortal,
  },

  {
    label: "Sign out",
    icon: CloseBold,
    divided: true,
    click: handleSignout,
  },
]);
async function handleSignout() {
  await signOut();
}
</script>
<template>
  <div>
    <header class="p-2 lg:px-12 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <el-container>
        <div class="w-full flex justify-between">
          <NuxtLink to="/">
            <Icon class="w-8 h-8" />
          </NuxtLink>

          <div class="inline-flex w-full justify-end gap-4 items-center">
            <slot name="actions"></slot>

            <!-- <UButton
                v-if="!(data?.user as IUser)?.hasActiveSubscription"
                variant="outline"
                color="amber"
                @click="showSubscriptionModal"
              >
                <UIcon name="i-heroicons-star" />
              </UButton> -->

            <!-- <ColorSwitcher /> -->
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <IconProfile />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) in dropdownItems"
                    :divided="item?.divided"
                    :key="index"
                    :icon="item?.icon"
                    :disabled="item?.disabled"
                    @click="item?.click && item?.click()"
                    class="lg:min-w-48"
                  >
                    <span v-if="item?.label == 'Profile'">
                      <p>Signed in as</p>
                      <p class="truncate font-medium text-gray-900 dark:text-white">
                        {{ data?.user?.email }}
                      </p>
                    </span>
                    <span v-else>{{ item.label }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-container>
    </header>

    <main class="lg:px-8">
      <el-container>
        <el-main>
          <slot />
        </el-main>
      </el-container>
    </main>
  </div>
</template>

<style></style>
