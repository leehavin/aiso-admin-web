<template>
  <a-drawer v-model:open="state.visible" :title="state.vm.form.key" placement="right" width="800px">
    <a-spin :spinning="state.loading">
      <div ref="monacoEditorContainer" class="monacoEditorContainer"></div>
    </a-spin>

    <template #extra>
      <a-space>
        <a-button @click="state.visible = false">取消</a-button>
        <a-button type="primary" @click="save()">提交</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import SysLocaleService from "@/services/system/SysLocaleService";
import Tools from "@/core/utils/Tools";
import { nextTick } from "vue";
import i18n from "@/locale/Main";
import LocaleUtils from "@/utils/LocaleUtils";

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    if (label === "html") {
      return new htmlWorker();
    }
    return new editorWorker();
  },
};

const { getLocale } = LocaleUtils();

const props = defineProps<{ onSuccess: () => void }>();

const monacoEditorContainer = ref<HTMLElement>();
// 修改 monaco editor 默认的右键菜单中的剪切、复制和粘贴菜单项的文本
let standaloneCodeEditor: monaco.editor.IStandaloneCodeEditor | null = null;

const state = reactive({
  vm: {
    id: "",
    form: {} as any,
  },
  visible: false,
  loading: false,
});

//向父级导出 函数
defineExpose({
  /**
   * 打开表单初始化
   * @param key
   */
  open: (key: string = "") => {
    state.visible = true;
    if (state.visible) {
      state.vm.id = key;
    }

    //初始化表单数据
    state.loading = true;
    SysLocaleService.findForm(key).then((res) => {
      state.loading = false;
      if (res.code != 200) return;
      state.vm = res.data;

      const locale = i18n.global.getLocaleMessage(res.data?.form.key);

      if (locale) {
        let value = null;
        try {
          value = JSON.parse(res.data?.form.value);
        } catch (d) {}
        res.data.form.value = JSON.stringify({ ...locale, ...value }, null, 2);
      }

      createCodeEditor(res.data?.form.value);
    });
  },
});

function createCodeEditor(value?: string) {
  standaloneCodeEditor?.dispose();

  nextTick(() => {
    if (!monacoEditorContainer.value) return;
    standaloneCodeEditor = monaco.editor.create(monacoEditorContainer.value, {
      value: value ?? `{}`,
      language: "json",
      theme: "vs-dark", // 主题
      folding: true, // 是否折叠
      foldingHighlight: true, // 折叠等高线
      foldingStrategy: "indentation", // 折叠方式  auto | indentation
      showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
      disableLayerHinting: true, // 等宽优化
      emptySelectionClipboard: false, // 空选择剪切板
      selectionClipboard: false, // 选择剪切板
      automaticLayout: true, // 自动布局
      codeLens: false, // 代码镜头
      scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
      colorDecorators: true, // 颜色装饰器
      accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
      lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
      lineNumbersMinChars: 5, // 行号最小字符   number
      readOnly: false, //是否只读  取值 true | false
    });
  });
}

/**
 *保存数据
 */
async function save() {
  if (!standaloneCodeEditor) {
    Tools.message.error("编辑器初始化失败!");
    return;
  }
  try {
    state.loading = true;
    state.vm.form.value = standaloneCodeEditor.getValue() ?? "{}";
    const result = await SysLocaleService.saveForm(state.vm.id, state.vm.form);
    state.loading = false;
    if (result.code != 200) return;
    Tools.message.success("操作成功!");

    getLocale();
    props.onSuccess();
    state.visible = false;
  } catch (error) {
    state.loading = false;
  }
}
</script>

<style lang="less" scoped>
.monacoEditorContainer {
  height: calc(100vh - 120px);
}
</style>
