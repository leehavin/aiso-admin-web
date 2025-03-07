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
  userName: "admin",
  userPassword: "123456",
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
            <a-input v-model:value="state.userName" placeholder="请输入" size="large" allow-clear>
              <template #prefix>
                <AppIcon name="UserOutlined" style="color: #1890ff; font-size: 14px" />
              </template>
            </a-input>
          </div>

          <div class="mt-24">
            <a-input-password type="password" v-model:value="state.userPassword" size="large" ref="inputPassword"
              @keyup.enter="check()">
              <template #prefix>
                <AppIcon name="LockOutlined" style="color: #1890ff; font-size: 14px" />
              </template>
            </a-input-password>
          </div>

          <div class="mt-24">
            <a-button type="primary" @click="check()" :loading="loading" size="large" block>
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

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  //可以解开一下注解 放置一个背景图片
  // background: url("../assets/images/login-1.jpg") no-repeat;
  // background-size: cover;

  .login-card {
    height: 500px;
    width: 1000px;
    box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, 0.85), 0px 12px 32px #000000, 0px 8px 16px -8px #000000;
    display: flex;
    border-radius: 5px;
    z-index: 9;

    .flex-left {
      flex: 1;
      width: 450px;

      img {
        height: 100%;
      }
    }

    .flex-right {
      flex: 1;
      // background-color: #ffffff;
      display: flex;
      justify-content: center;
      flex-direction: column;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    .title {
      text-align: center;
      font-size: 30px;
      padding: 20px;
      font-weight: bold;
      background-color: #ffffff;
      border-radius: 10px;
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
    border-radius: 5px;
  }
}

@media (min-width: 600px) and (max-width: 1024px) {
  .login-card {
    width: 70% !important;
  }
}

@media (max-width: 600px) {
  .login-card {
    // flex-direction: column;
    width: 100% !important;
  }
}

.lang-content {
  position: absolute;
  right: 24px;
  top: 20px;
  z-index: 9;
}
</style>
