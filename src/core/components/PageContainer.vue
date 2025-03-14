<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import router from "../router";
import AppStore from "../store/AppStore";
import { MenuItemModel } from "../store/layouts/MenuStore";
import AppIcon from "@/core/components/AppIcon.vue";
import AppConsts from "@/utils/AppConsts";
import ThemeStore from "../store/layouts/ThemeStore";
import { translate } from "@/locale/Main.js";

const props = withDefaults(
  defineProps<{
    /**
     * 是否显示
     */
    show?: boolean;
    /**
     * 详情
     */
    describe?: string;
    /**
     * pading class
     */
    classPadding?: string;
    /**
     * 主体内容 pading class
     */
    bodyClassPadding?: string;
    /**
     * 主体内容样式
     */
    bodyStyle?: Object;
  }>(),
  {
    show: true,
  }
);

const appStore = AppStore();
const navs = ref<MenuItemModel[]>([]);
const themeStore = ThemeStore();

onMounted(() => {
  navs.value = handlePaths();
  document.title = AppConsts.appTitle + " - " + router.currentRoute.value.meta.title;
});

onBeforeUnmount(() => {
  document.title = AppConsts.appTitle;
});

/**
 * 处理地址
 */
function handlePaths() {
  let route = router.currentRoute.value;
  let levelCode = route.meta.levelCode as string;
  if (!levelCode) return [];
  const menus = [];
  if (levelCode.indexOf(".") > -1) {
    var ids = levelCode.split(".");
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      const menuItem = appStore.state.userInfo.menus.find((w) => w.id == (id as any));
      menus.push(menuItem);
    }
  } else {
    const menuItem = appStore.state.userInfo.menus.find((w) => (w.id = levelCode as any));
    menus.push(menuItem);
  }
  return menus as MenuItemModel[];
}
</script>

<template>
  <div v-if="props.show">
    <div class="pt-16 pl-16 pr-16">
      <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
        <div :class="{ 'pl-16 pr-16 pt-16 pb-16': !classPadding }">
          <slot name="nav">
            <a-breadcrumb>
              <a-breadcrumb-item v-for="item in navs">
                <AppIcon :name="item.icon" v-if="item.icon" />
                <span>{{ translate(`menu.${item.name}`, item.name) }}</span>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </slot>
          <!-- <div class="mt-16">
        <span style="font-weight: bold; font-size: 20px; color: rgba(0, 0, 0, 0.85)">{{ router.currentRoute.value.meta.title }}</span>
      </div> -->
          <slot name="describe">
            <div class="mt-8" v-if="props.describe">
              <span>{{ props.describe }}</span>
            </div>
          </slot>
        </div>
      </a-card>
    </div>

    <div :class="{ 'p-16': !bodyClassPadding }" :style="{ ...(props.bodyStyle ?? {}) }">
      <slot></slot>
    </div>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>
