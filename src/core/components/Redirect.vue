<script lang="ts" setup>
import router from "@/core/router/index.js";
import { onMounted } from "vue";
defineOptions({ name: "RedirectCom" });

onMounted(() => {
  const { params, query } = router.currentRoute.value;
  const { path } = params;
  router.replace({ path: "/" + path, query });
});
</script>

<template>
  <div class="p-16">
    <a-spin />
  </div>
</template>
@/core/router/index1.js
