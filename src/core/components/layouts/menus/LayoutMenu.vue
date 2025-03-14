<script lang="ts" setup>
import { reactive, computed, watch } from "vue";
import AppIcon from "@/core/components/AppIcon.vue";
import router from "@/core/router/index.js";
import LayoutMenuSub from "./LayoutMenuSub.vue";
import MenuStore, { EMenuMode } from "@/core/store/layouts/MenuStore";
import AppStore from "@/core/store/AppStore";
import Tools from "@/core/utils/Tools";
import ThemeStore from "@/core/store/layouts/ThemeStore";
import { translate } from "@/locale/Main.js";

const themeStore = ThemeStore();
const menuStore = MenuStore();
const appStore = AppStore();
// const currentRoutePath = computed(() => router.currentRoute.value.fullPath);
const menuTree = computed(() => {
  return Tools.genTreeData(appStore.state.userInfo.menus, null);
});

const state = reactive({
  defaultSelectedKeys: [router.currentRoute.value.meta.menuId ?? ""],
  selectedKeys: [router.currentRoute.value.meta.menuId ?? ""],
  openKeys: getOpenMenuKeys(),
});

watch(
  () => router.currentRoute.value,
  (value) => {
    state.selectedKeys = [value.meta.menuId ?? ""];
  }
);

/**
 * 获取当前打开的菜单 并找到他的所有父级
 * @returns
 */
function getOpenMenuKeys(): number[] {
  let route = router.currentRoute.value;
  let levelCode = route.meta.levelCode as string;
  if (!levelCode) return [];
  var keys = [];
  if (levelCode.indexOf(".") > -1) {
    var ids = levelCode.split(".");
    for (var i = 0; i < ids.length - 1; i++) {
      var id = ids[i];
      keys.push(parseInt(id));
    }
  }
  return keys;
}

/**
 * 菜单选中
 * @param obj
 */
function onMenuSelected(obj: any) {
  const menuItem = appStore.state.userInfo.menus.find((w) => w.id == obj.key);
  router.push({ path: menuItem?.jumpUrl ?? menuItem?.router ?? "/404" });
}
</script>

<template>
  <a-menu mode="inline" :theme="themeStore.state.menuTheme.isDark ? 'dark' : 'light'" @select="onMenuSelected" v-model:selectedKeys="state.selectedKeys" v-model:openKeys="state.openKeys">
    <!-- 动态生成 topNav-->
    <template v-if="menuStore.state.menuMode != EMenuMode.default">
      <template v-for="item in appStore.state.subMenus?.filter((w:any) => w.show)">
        <a-menu-item v-if="!item.children || (item.children?.filter((w:any) => w.show).length == 0 && item.type == 2)" :key="item.id" :title="translate(`menu.${item.name}`, item.name)">
          <AppIcon :name="item.icon" v-if="item.icon" />
          <span>{{ translate(`menu.${item.name}`, item.name) }}</span>
        </a-menu-item>
        <LayoutMenuSub v-else :menu-info="item" />
      </template>
    </template>
    <template v-else>
      <template v-for="item in menuTree?.filter((w:any) => w.show)">
        <a-menu-item v-if="!item.children || (item.children?.filter((w:any) => w.show).length == 0 && item.type == 2)" :key="item.id" :title="translate(`menu.${item.name}`, item.name)">
          <AppIcon :name="item.icon" v-if="item.icon" />
          <span>{{ translate(`menu.${item.name}`, item.name) }}</span>
        </a-menu-item>
        <LayoutMenuSub v-else :menu-info="item" />
      </template>
    </template>
  </a-menu>
</template>

<style lang="less">
.aiso-menu {
  .ant-menu {
    border-inline-end: 0 !important;
  }
}
</style>
