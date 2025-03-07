<script lang="ts" setup>
import LayoutStore from "@/core/store/layouts/CoreStore";
import MenuStore from "@/core/store/layouts/MenuStore";
import HeaderStore from "@/core/store/layouts/HeaderStore";
import SettingsStore from "@/core/store/layouts/SettingsStore";
import ThemeStore from "@/core/store/layouts/ThemeStore";
import AppIcon from "@/core/components/AppIcon.vue";

const layoutStore = LayoutStore();
const menuStore = MenuStore();
const headerStore = HeaderStore();
const settingsStore = SettingsStore();
const themeStore = ThemeStore();

// 取色器 防抖渲染
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const changeColorPrimary = debounce((color:any) => {
  themeStore.changeColorPrimary(color);
}, 1000);

</script>

<template>
  <a-drawer class="hzy-settings" placement="right" width="350px" :closable="false"
    v-model:open="settingsStore.state.show">

    <a-divider>白昼 / 黑夜</a-divider>
    <div class="mt-24 text-center" style="
        display:flex; 
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;">
      <div @click="themeStore.changeTheme(!themeStore.state.isDark)"
        style="width: 80px; height: 80px; text-align: center; cursor: pointer;">
        <AppIcon name="MoonNight" :size="16" style="color:white" v-if="themeStore.state.isDark" />
        <AppIcon name="Sunny" :size="16" v-else />
      </div>
    </div>

    <a-divider>品牌色</a-divider>
    <div class="hzy-skin-list mb-5 text-center">
      <template v-for="(item, index) in themeStore.colorPrimaryList" :key="index">
        <div class="hzy-skin-item" :style="{ backgroundColor: item.colorPrimary }"
          @click="themeStore.changeColorPrimary(item)"></div>
      </template>
    </div>

    <a-button block @click="headerStore.changeUseColorPrimary()">
      {{ headerStore.state.useColorPrimary ? "头部不使用品牌色" : "头部使用品牌色" }}
    </a-button>

    <a-divider>基础文本 / 基础背景颜色</a-divider>
    <div class="mt-24 text-center">
      <div class="hzy-skin-list mb-5 text-center">
        <a-space>
          <a-button type="link">基础背景色</a-button>
          <a-input v-model:value="themeStore.state.tokenTheme!.colorBgBase" />
          <a-input type="color" :value="themeStore.state.tokenTheme!.colorBgBase"
            @change="e => changeColorPrimary({ colorBgBase: e.target.value })" style="width:80px" />
        </a-space>
        <a-space class="mt-5">
          <a-button type="link">基础文本色</a-button>
          <a-input v-model:value="themeStore.state.tokenTheme!.colorTextBase" />
          <a-input type="color" :value="themeStore.state.tokenTheme!.colorTextBase"
            @change="e => changeColorPrimary({ colorTextBase: e.target.value })" style="width:80px" />
        </a-space>
      </div>
    </div>

    <a-divider>菜单颜色</a-divider>
    <div class="mt-24 text-center">
      <div class="hzy-skin-list mb-5 text-center">
        <template v-for="(item, index) in themeStore.menuThemeList" :key="index">
          <div class="hzy-skin-item" style="border: 1px solid #67c23a" :style="{ backgroundColor: item.colorItemBg }"
            @click="themeStore.changeMenuTheme(index)"></div>
        </template>
      </div>
    </div>

    <a-divider v-if="!layoutStore.state.isMobile">菜单栏模式</a-divider>
    <div class="mt-24 text-center" v-if="!layoutStore.state.isMobile">
      <a-radio-group name="radioGroup" defaultValue="1" v-model:value="menuStore.state.menuMode">
        <a-radio value="1">默认</a-radio>
        <a-radio value="2">顶部</a-radio>
        <a-radio value="3">左侧</a-radio>
      </a-radio-group>
    </div>
  </a-drawer>
</template>

<style lang="less" scoped>
.hzy-settings {
  .hzy-skin-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .hzy-skin-item {
      width: 40px;
      height: 40px;
      margin: 8px;
      cursor: pointer;
      border-radius: 8px;
    }
  }
}
</style>
