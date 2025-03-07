<template>
  <a-modal v-model:open="state.open" title="上传附件" centered @ok="onClose" @cancel="onClose" :width="800">
    <div class="modal-content">
      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="true"
        :customRequest="uploadFile"
        @change="handleChange"
        @remove="onRemove"
        @drop="handleDrop">
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p class="ant-upload-hint">支持单次或批量上传。严禁上传公司数据或文件</p>
      </a-upload-dragger>
    </div>
  </a-modal>

  <a-modal v-model:open="state.cancelUploadOpen" title="提示" @ok="onCanceUpload">
    <p>存在未上传完成的任务是否取消?</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { UploadChangeParam } from "ant-design-vue";
import SysFileService from "@/services/system/SysFileService";

const emits = defineEmits<{
  (e: "onClose"): void;
}>();

const uploadRequests = new Map();

const state = reactive({
  open: false,
  cancelUploadOpen: false,
});

const fileList = ref([]);
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== "uploading") {

  }
  if (status === "done") {
    // message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
};
function handleDrop(e: DragEvent) {
}

async function uploadFile(args: any) {

  try {
    // 创建 Axios 的 CancelToken
    const abort = new AbortController();

    // 将请求源保存到 uploadRequests Map 中
    uploadRequests.set(args.file.uid, abort);

    const res = await SysFileService.uploadFile(args.file, abort, (percent) => {
      args.onProgress({ percent });
    });

    args.onSuccess(res, args.file);
  } catch (e) {
    args.onError(e);
  } finally {
    // 上传完成后，删除请求源
    uploadRequests.delete(args.file.uid);
  }
}

function onRemove(file: any) {
  console.log(file);
  const abort = uploadRequests.get(file.uid);
  console.log(abort);

  if (abort) {
    abort.abort();
  }
}

function onClose(e: MouseEvent) {
  e.preventDefault();

  if (uploadRequests.size > 0) {
    state.open = true;
    state.cancelUploadOpen = true;
    return;
  }

  emits("onClose");
  state.open = false;
}

function onCanceUpload() {
  uploadRequests.forEach((abort) => {
    abort.abort();
  });

  emits("onClose");
  state.cancelUploadOpen = false;
  state.open = false;
}

defineExpose({
  /**
   * 打开表单初始化
   * @param key
   */
  open: () => {
    state.open = true;
    fileList.value = [];
  },
});
</script>

<style lang="css" scoped>
.modal-content {
  max-height: 80vh;
  overflow: hidden;
  overflow-y: auto;
  padding: 16px;
}
</style>
