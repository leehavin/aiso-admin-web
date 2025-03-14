<script lang="ts" setup>
import router from "@/core/router/index.js";
import AppIcon from "@/core/components/AppIcon.vue";
import { useDark, useFullscreen } from "@vueuse/core";
import LayoutOneLevelMenu from "./menus/LayoutMenuOneLevel.vue";
import AppStore from "@/core/store/AppStore";
import CoreStore from "@/core/store/layouts/CoreStore";
import MenuStore, { EMenuMode } from "@/core/store/layouts/MenuStore";
import HeaderStore from "@/core/store/layouts/HeaderStore";
import SettingsStore from "@/core/store/layouts/SettingsStore";
import Tools from "@/core/utils/Tools";
import ThemeStore from "@/core/store/layouts/ThemeStore";
import LanguageComponent from "@/locale/components/LanguageComponent.vue";
import { computed } from "vue";

const appStore = AppStore();
const coreStore = CoreStore();
const menuStore = MenuStore();
const headerStore = HeaderStore();
const settingsStore = SettingsStore();
const themeStore = ThemeStore();

/**
 * 用于计算鼠标移动到功能按钮时背景色计算
 */
const aisoHeaderBtnHover = computed(() => {
  if (themeStore.state.isDark) {
    return "rgba(255, 255, 255, 0.2)";
  }
  return "rgba(0, 0, 0, 0.04)";
});

const iconSize = 16;

const { isFullscreen, enter, exit, toggle } = useFullscreen();

// 退出登录
function logOut() {
  Tools.confirm("您确定要退出登录吗?", () => router.push("/login"));
}

// 刷新
function onReload() {
  coreStore.refresh(router.currentRoute.value.fullPath);
}

//文档地址
function jumpDoc() {
  window.open("https://www.yuque.com/u378909/yidf7v", "_black");
}

//pro
function jumpPro() {
  window.open("http://124.221.128.7:6600/", "_black");
}
</script>

<template>
  <a-layout-header class="aiso-layout-header">
    <div class="aiso-header-btn" @click="menuStore.onChangeCollapse(!menuStore.state.isCollapse)">
      <!-- <a-tooltip>
        <template #title>菜单收展</template>
<AppIcon :name="menuStore.state.isCollapse ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'" :size="iconSize" />
</a-tooltip> -->
      <AppIcon :name="menuStore.state.isCollapse ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'" :size="iconSize" />
    </div>
    <div style="flex: 1 1 0%; height: 100%; display: flex" v-if="menuStore.state.menuMode == EMenuMode.top">
      <LayoutOneLevelMenu />
    </div>
    <div style="flex: 1 1 0%" v-else></div>

    <!-- 刷新当前选项卡 -->
    <a-tooltip>
      <template #title>刷新当前选项卡</template>
      <div class="aiso-header-btn" @click="onReload">
        <AppIcon name="ReloadOutlined" :size="iconSize" />
      </div>
    </a-tooltip>

    <!-- 全屏 -->
    <a-tooltip>
      <template #title>全屏</template>
      <div class="aiso-header-btn" @click="toggle" v-if="!coreStore.state.isMobile">
        <AppIcon :name="isFullscreen ? 'FullscreenExitOutlined' : 'FullscreenOutlined'" :size="iconSize" />
      </div>
    </a-tooltip>

    <!-- 白昼 / 黑夜 -->
    <a-tooltip>
      <template #title>白昼 / 黑夜</template>
      <div class="aiso-header-btn" @click="themeStore.changeTheme(!themeStore.state.isDark)">
        <AppIcon name="MoonNight" :size="iconSize + 5" style="color:white" v-if="themeStore.state.isDark" />
        <AppIcon name="Sunny" :size="iconSize + 5" v-else />
      </div>
    </a-tooltip>

    <!-- 国际化 -->
    <LanguageComponent>
      <div class="aiso-header-btn">
        <AppIcon name="TranslationOutlined" :size="iconSize" />
      </div>
    </LanguageComponent>

    <a-dropdown>
      <div class="aiso-header-btn">
        <AppIcon name="UserOutlined" :size="iconSize" />
        &nbsp;&nbsp;
        <span>{{ appStore.state.userInfo.name ? appStore.state.userInfo.name : "未知用户" }}</span>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="logOut">
            <a href="javascript:;">
              <AppIcon name="LogoutOutlined" />&nbsp;&nbsp;退出登录
            </a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- 界面设置 -->
    <a-tooltip>
      <template #title>界面设置</template>
      <div class="aiso-header-btn" @click="settingsStore.isShow()">
        <AppIcon name="SettingOutlined" :size="iconSize" />
      </div>
    </a-tooltip>
  </a-layout-header>
</template>

<style lang="less">
.aiso-layout {

  //覆盖样式
  .ant-layout-header {
    position: relative;
    z-index: 6;
    width: 100%;
    height: auto !important;
    line-height: normal !important;
  }

  //=======// 头部
  .aiso-layout-header {
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    height: 48px !important;
    //
    transition: background-color 0.1s;
    -moz-transition: background-color 0.1s;
    /* Firefox 4 */
    -webkit-transition: background-color 0.1s;
    /* Safari 和 Chrome */
    -o-transition: background-color 0.1s;

    .aiso-header-btn {
      padding: 0 8px;
      cursor: pointer;
      height: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .aiso-header-btn:hover {
      background: v-bind("aisoHeaderBtnHover");
    }
  }
}
</style>
