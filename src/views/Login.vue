<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import AppIcon from "@/core/components/AppIcon.vue";
import router from "@/core/router/index.js";
import Tools from "@/core/utils/Tools";
import AppStore from "@/core/store/AppStore";
import LoginService from "@/services/LoginService";
import LanguageComponent from "@/locale/components/LanguageComponent.vue";
import i18n from "@/locale/Main.js";

const state = reactive({
  userName: "",
  userPassword: "",
});
const inputPassword = ref<HTMLElement | null>(null);
const loading = ref(false);

const appStore = AppStore();
const title = appStore.state.title;

onMounted(() => {
  reset();
  inputPassword.value!.focus();
});

/**
 * 检查账户并登录
 */
async function check() {
  if (!state.userName) {
    return Tools.message.warning(i18n.global.t("login.validate.username"));
  }

  if (!state.userPassword) {
    return Tools.message.warning(i18n.global.t("login.validate.userPassword"));
  }

  try {
    loading.value = true;
    const result = await LoginService.login(state.userName, state.userPassword);
    loading.value = false;
    if (result.code != 200) return;
    const token = result.data.tokenType + " " + result.data.accessToken;
    Tools.setAuthorization(token, result.data.refreshToken);
    // router.push("/");
    window.location.href = window.location.origin;
  } catch (error) {
    loading.value = false;
  }
}

/**
 * 重置系统信息
 */
function reset() {
  Tools.removeAuthorization();
  appStore.resetInfo();
}
</script>

<template>
  <div>
    <div class="lang-content">
      <LanguageComponent />
    </div>
    <div class="animated-background"></div>

    <div class="login">
      <div class="login-card">
        <div class="login-card-inner">
        <div class="flex-right p-30">
          <div class="title mb-24">{{ $t("login.title") }}</div>

          <div class="mt-24">
            <a-input v-model:value="state.userName" size="large" allow-clear class="custom-input">
              <template #prefix>
                <AppIcon name="UserOutlined" style="color: #4db8ff; font-size: 14px" />
              </template>
            </a-input>
          </div>

          <div class="mt-24">
            <a-input-password type="password" v-model:value="state.userPassword" size="large" ref="inputPassword"
              @keyup.enter="check()" class="custom-input">
              <template #prefix>
                <AppIcon name="LockOutlined" style="color: #4db8ff; font-size: 14px" />
              </template>
            </a-input-password>
          </div>

          <div class="mt-24">
            <a-button type="primary" @click="check()" :loading="loading" size="large" block class="login-button">
              {{ $t("login.submit") }}
            </a-button>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
/* 基础样式 */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 苹果风格科技感背景 */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(125deg, #1e2128 0%, #0c1019 100%);
  overflow: hidden;

  /* 磨砂玻璃网格效果 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 35%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 35%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.07) 0%, transparent 60%);
    background-size: 100% 100%;
    opacity: 0.9;
    filter: blur(2px);
    animation: subtleShift 20s ease-in-out infinite alternate;
  }

  /* 动态粒子效果 - 更精细的苹果风格星尘效果 */
  &::after {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background-image:
      radial-gradient(1.5px 1.5px at 40px 70px, rgba(255, 255, 255, 0.12) 0%, transparent 100%),
      radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.08) 0%, transparent 100%),
      radial-gradient(2px 2px at 140px 130px, rgba(255, 255, 255, 0.12) 0%, transparent 100%),
      radial-gradient(1px 1px at 210px 80px, rgba(255, 255, 255, 0.08) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 240px 180px, rgba(255, 255, 255, 0.12) 0%, transparent 100%),
      radial-gradient(1px 1px at 280px 40px, rgba(255, 255, 255, 0.08) 0%, transparent 100%),
      radial-gradient(1px 1px at 320px 120px, rgba(255, 255, 255, 0.12) 0%, transparent 100%),
      radial-gradient(2px 2px at 390px 60px, rgba(255, 255, 255, 0.08) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 440px 190px, rgba(255, 255, 255, 0.12) 0%, transparent 100%),
      radial-gradient(1px 1px at 490px 70px, rgba(255, 255, 255, 0.08) 0%, transparent 100%),
      radial-gradient(2px 2px at 520px 120px, rgba(255, 255, 255, 0.12) 0%, transparent 100%);
    background-repeat: repeat;
    background-size: 600px 600px;
    opacity: 0.3;
    animation: subtleFloat 80s linear infinite;
    transform-origin: center center;
  }
}

/* 添加苹果风格的动态光晕效果 */
.animated-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 30% 40%, rgba(114, 137, 218, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at 70% 60%, rgba(59, 178, 184, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse at 10% 90%, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
  filter: blur(50px);
  opacity: 0.7;
  mix-blend-mode: screen;
  animation: breathe 12s ease-in-out infinite alternate;
  pointer-events: none;
}

/* 动画定义 */
@keyframes subtleShift {
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: 100% 100%;
  }
}

@keyframes subtleFloat {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes breathe {

  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {

  0%,
  100% {
    box-shadow: 0 0 5px rgba(77, 184, 255, 0.3), 0 0 10px rgba(77, 184, 255, 0.2), 0 0 15px rgba(77, 184, 255, 0.1);
  }

  50% {
    box-shadow: 0 0 10px rgba(77, 184, 255, 0.4), 0 0 20px rgba(77, 184, 255, 0.3), 0 0 30px rgba(77, 184, 255, 0.2);
  }
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(77, 184, 255, 0);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(77, 184, 255, 0);
  }
}

/* 浮动粒子效果 */
.login::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 2.5%),
    radial-gradient(circle at 75% 45%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 2.5%),
    radial-gradient(circle at 35% 60%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 2.5%),
    radial-gradient(circle at 65% 75%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 2.5%),
    radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 2.5%),
    radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 2.5%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 3.5%);
  background-size: 200% 200%;
  filter: blur(1px);
  opacity: 0.8;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
    z-index: 0;
    backdrop-filter: blur(5px);
  }

  .login-card {
    height: 450px;
    width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
    display: flex;
    border-radius: 20px;
    z-index: 9;
    background-color: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    animation: fadeIn 0.8s ease-out;
    position: relative;
    overflow: hidden;
    
    .login-card-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06) 15%, rgba(255, 255, 255, 0) 50%);
      border-radius: 20px;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
      z-index: -1;
      opacity: 0.8;
    }

    @keyframes shine {
      0% {
        transform: translate(-30%, -30%) rotate(0deg);
      }

      100% {
        transform: translate(-30%, -30%) rotate(360deg);
      }
    }

    .flex-left {
      flex: 1;
      width: 450px;

      img {
        height: 100%;
      }
    }

    .flex-right {
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      border-radius: 20px;
      color: #ffffff;
      padding: 0 40px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 60%),
          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 60%);
        pointer-events: none;
        opacity: 0.8;
      }
    }

    .title {
      text-align: center;
      font-size: 32px;
      padding: 20px;
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 20px;
      letter-spacing: 1px;
      position: relative;
      animation: fadeIn 0.6s ease-out;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 40px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(-50%);
        border-radius: 1px;
      }
    }
  }
}

.lang-content {
  position: absolute;
  right: 24px;
  top: 20px;
  z-index: 9;
  animation: fadeIn 0.8s ease-out 0.6s both;

  &:hover {
    transform: translateY(-2px);
    transition: transform 0.3s ease;
  }
}

.custom-input {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 14px !important;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1) !important;
  animation: fadeIn 0.8s ease-out 0.2s both;
  height: 50px !important;
  backdrop-filter: blur(15px) !important;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
  }

  &:focus-within {
    border-color: rgba(77, 184, 255, 0.4) !important;
    box-shadow: 0 0 0 3px rgba(77, 184, 255, 0.15) !important;
    transform: translateY(-1px) !important;
  }

  :deep(input) {
    background-color: transparent !important;
    color: #ffffff !important;
    font-size: 15px !important;
    font-weight: 400 !important;
  }

  :deep(.ant-input-affix-wrapper) {
    background-color: transparent !important;
    border: none !important;
  }

  :deep(.ant-input-prefix) {
    margin-right: 12px !important;
    opacity: 0.9 !important;
  }
}

.login-button {
  background: linear-gradient(135deg, rgba(77, 184, 255, 0.4), rgba(59, 178, 184, 0.4)) !important;
  border: none !important;
  height: 50px !important;
  border-radius: 14px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  letter-spacing: 1px !important;
  backdrop-filter: blur(15px) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1) !important;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out 0.4s both;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    z-index: -1;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(77, 184, 255, 0.35), rgba(59, 178, 184, 0.35)) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
  }

  &:active {
    transform: translateY(1px) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    background: linear-gradient(135deg, rgba(77, 184, 255, 0.25), rgba(59, 178, 184, 0.25)) !important;
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.5;
    }

    20% {
      transform: scale(25);
      opacity: 0.3;
    }

    100% {
      transform: scale(40);
      opacity: 0;
    }
  }
}
</style>
