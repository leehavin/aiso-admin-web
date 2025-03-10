<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import AppIcon from "@/core/components/AppIcon.vue";
import router from "@/core/router/index.js";
import Tools from "@/core/utils/Tools";
import AppStore from "@/core/store/AppStore";
import LoginService from "@/services/LoginService";
import LanguageComponent from "@/locale/components/LanguageComponent.vue";
import i18n from "@/locale/Main.js";
import video from "@/assets/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr.mp4";

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
    <div
      style="position: absolute; top: 0px; left: 0px; width: 100%; overflow: hidden; height: 100%; z-index: 1; pointer-events: none;">
      <video ref="videoDom" autoplay playsinline loop muted crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: cover;">
        <source :src="video" type="video/mp4">
        您的浏览器不支持 video 标签。
      </video>
    </div>

    <div class="login">
      <div class="login-card">
        <div class="flex-left">
          <img src="../assets/images/info_service.png" alt="" />
        </div>
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
</template>

<style lang="less" scoped>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(77, 184, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(77, 184, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(77, 184, 255, 0); }
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  //可以解开一下注解 放置一个背景图片
  // background: url("../assets/images/login-1.jpg") no-repeat;
  // background-size: cover;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
    z-index: 0;
  }

  .login-card {
    height: 500px;
    width: 1000px;
    box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, 0.5), 0px 12px 32px rgba(0, 0, 0, 0.3), 0px 8px 16px -8px rgba(0, 0, 0, 0.2);
    display: flex;
    border-radius: 16px;
    z-index: 9;
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    animation: fadeIn 0.8s ease-out;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent 45%, rgba(77, 184, 255, 0.05) 50%, transparent 55%);
      z-index: -1;
      animation: shine 6s infinite linear;
    }
    
    @keyframes shine {
      0% { transform: translate(-30%, -30%) rotate(0deg); }
      100% { transform: translate(-30%, -30%) rotate(360deg); }
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
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      color: #ffffff;
      padding: 0 40px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at top right, rgba(77, 184, 255, 0.05) 0%, transparent 70%);
        pointer-events: none;
      }
    }

    .title {
      text-align: center;
      font-size: 32px;
      padding: 20px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 0 10px rgba(77, 184, 255, 0.5);
      margin-bottom: 20px;
      letter-spacing: 2px;
      position: relative;
      animation: fadeIn 0.6s ease-out;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, rgba(77, 184, 255, 0.2), rgba(77, 184, 255, 0.8), rgba(77, 184, 255, 0.2));
        transform: translateX(-50%);
        border-radius: 3px;
      }
    }

    .el-input-group__append {
      padding: 0 !important;

      .login-code {
        height: 38px;
      }
    }
  }
}

//小于 1024 像素 选择采用此样式
@media (max-width: 1024px) {
  .flex-left {
    display: none;
    flex: 0 !important;

    img {
      height: auto !important;
      width: 80% !important;
    }
  }

  .flex-right {
    border-radius: 16px;
    padding: 0 30px !important;
  }
  
  .login-card {
    box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.5) !important;
  }
}

@media (min-width: 600px) and (max-width: 1024px) {
  .login-card {
    width: 70% !important;
    height: 450px !important;
  }
}

@media (max-width: 600px) {
  .login-card {
    width: 90% !important;
    height: auto !important;
    min-height: 400px;
    padding: 30px 0;
  }
  
  .title {
    font-size: 28px !important;
    padding: 10px !important;
  }
  
  .login-button {
    height: 44px !important;
  }
}

.lang-content {
  position: absolute;
  right: 24px;
  top: 20px;
  z-index: 9;
  animation: fadeIn 0.8s ease-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-2px);
    transition: transform 0.3s ease;
  }
}

.custom-input {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  margin-bottom: 5px !important;
  animation: fadeIn 0.8s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.2s;
  
  &:hover {
    border: 1px solid rgba(77, 184, 255, 0.4) !important;
    box-shadow: 0 0 10px rgba(77, 184, 255, 0.1) !important;
  }
  
  &:focus-within {
    border: 1px solid rgba(77, 184, 255, 0.6) !important;
    box-shadow: 0 0 15px rgba(77, 184, 255, 0.2) !important;
  }
  
  :deep(input) {
    background-color: transparent !important;
    color: #ffffff !important;
    transition: all 0.3s ease !important;
  }
  
  :deep(.ant-input-affix-wrapper) {
    background-color: transparent !important;
    border: none !important;
  }
}

.login-button {
  background: linear-gradient(90deg, #1890ff, #4db8ff) !important;
  border: none !important;
  height: 48px !important;
  border-radius: 8px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  letter-spacing: 1px !important;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.4s;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4) !important;
  }
  
  &:active {
    box-shadow: 0 2px 10px rgba(24, 144, 255, 0.3) !important;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
}
</style>
