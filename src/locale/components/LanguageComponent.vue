<script setup lang="ts">
import CoreStore from "@/core/store/layouts/CoreStore";
import LocaleUtils from "@/utils/LocaleUtils";
const coreStore = CoreStore();
const { getLocale } = LocaleUtils();

const changeLanguage = (locale: string) => {
  coreStore.setLocale(locale);
  getLocale();
};
</script>

<template>
  <!--多语言下拉框-->
  <a-dropdown>
    <slot>
      <a-button>
        <template #icon>
          <TranslationOutlined/>
        </template>
      </a-button>
    </slot>

    <template #overlay>
      <a-menu>
        <a-menu-item @click="changeLanguage('zh-CN')">
          <!--            <a href="javascript:;"></a>-->
          <div :style="{ color: coreStore.state.locale == 'zh-CN' ? 'var(--primary-color)' : '' }">中文</div>
        </a-menu-item>
        <a-menu-item @click="changeLanguage('en-US')">
          <!--            <a href="javascript:;"></a>-->
          <div :style="{ color: coreStore.state.locale == 'en-US' ? 'var(--primary-color)' : '' }">English</div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
