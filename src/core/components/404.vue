<script lang="ts" setup>
import router from "@/core/router/index.js";
import { ref, onMounted, onUnmounted } from 'vue';
defineOptions({ name: "404" });

const countdown = ref(5);
const timer = ref<number | null>(null);

function goHome() {
  router.push("/home");
}

onMounted(() => {
  timer.value = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer.value as number);
      goHome();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <img src="@/assets/undraw_Tree_swing_re_pqee.png" alt="404 图片" class="not-found-image" />
      <a-result status="404" title="404" sub-title="对不起，您访问的页面不存在。">
        <template #extra>
          <div class="action-container">
            <a-button type="primary" size="large" @click="goHome()" class="home-button">
              <template #icon><icon-home /></template>
              返回首页 ({{ countdown }}s)
            </a-button>
          </div>
        </template>
      </a-result>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 800px;
  width: 100%;
  animation: fadeIn 0.5s ease-in-out;
}

.not-found-image {
  max-width: 300px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.action-container {
  margin-top: 20px;
}

.home-button {
  min-width: 180px;
  transition: all 0.3s ease;
}

.home-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 768px) {
  .not-found-image {
    max-width: 200px;
  }
  
  .not-found-content {
    padding: 20px;
  }
}
</style>
